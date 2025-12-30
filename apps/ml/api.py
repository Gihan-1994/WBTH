"""
Flask API for ML-based accommodation and guide recommendations.
Integrates with PostgreSQL database and recommendation engines.
"""

import os
import json
from typing import List, Dict, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from recommender import AccommodationRecommender, load_accommodations
from GuidesRecommendationModel.guide_recommender import GuideRecommender

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend API calls

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')
FLASK_PORT = os.getenv('FLASK_PORT')

def get_db_connection():
    """Create and return a database connection."""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise


def fetch_accommodations_from_db(
    budget_min: Optional[float] = None,
    budget_max: Optional[float] = None,
    district: Optional[str] = None,
    province: Optional[str] = None,
    amenities: Optional[List[str]] = None
) -> List[Dict]:
    """
    Fetch accommodations from PostgreSQL database.
    
    Args:
        budget_min: Minimum budget filter (optional)
        budget_max: Maximum budget filter (optional)
        district: District filter (optional)
        province: Province filter (optional)
        amenities: List of required amenities (optional)
    
    Returns:
        List of accommodation dictionaries in ML model format
    """
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Build dynamic query
        query = """
            SELECT 
                a.id,
                a.name,
                a.type,
                a.amenities,
                a.rating,
                a.district,
                a.price_range_min,
                a.price_range_max,
                a.province,
                a.interests,
                a.travel_style,
                a.group_size,
                a.prior_bookings,
                ap.company_name as provider_name
            FROM accommodations a
            LEFT JOIN accommodation_providers ap ON a.provider_id = ap.provider_id
            WHERE 1=1
        """
        params = []
        
        # Add filters
        if budget_min is not None and budget_max is not None:
            query += " AND (a.price_range_min <= %s AND a.price_range_max >= %s)"
            params.extend([budget_max, budget_min])
        
        if district:
            query += " AND a.district = %s"
            params.append(district)
        
        if province:
            query += " AND a.province = %s"
            params.append(province)
        
        # Execute query
        cur.execute(query, params)
        results = cur.fetchall()
        
        # Transform to ML model format
        accommodations = []
        for row in results:
            # Amenities filter removed - now treated as preference in scoring
            # This allows partial amenity matches
            
            accommodation = {
                'id': row['id'],
                'name': row['name'],
                'type': row.get('type') or [],
                'amenities': row.get('amenities') or [],
                'rating': row.get('rating'),
                'district': row.get('district'),
                'price_range_min': row.get('price_range_min') or 0,
                'price_range_max': row.get('price_range_max') or 0,
                'province': row.get('province'),
                'interests': row.get('interests') or [],
                'travel_style': row.get('travel_style') or [],
                'group_size': row.get('group_size') or 1,
                'prior_bookings': row.get('prior_bookings') or 0,
                'availability': True,  # Assume available
                'provider_name': row.get('provider_name'),
                'in_system': True  # Flag to indicate this is real data
            }
            accommodations.append(accommodation)
        
        return accommodations
    
    finally:
        cur.close()
        conn.close()


def get_hybrid_accommodations(
    budget_min: float,
    budget_max: float,
    required_amenities: List[str],
    district: Optional[str] = None,
    province: Optional[str] = None,
    min_real_data: int = 5
) -> List[Dict]:
    """
    Get accommodations with hybrid approach: real DB data + mock data fallback.
    
    Args:
        budget_min: Minimum budget
        budget_max: Maximum budget
        required_amenities: List of required amenities
        district: Preferred district
        province: Preferred province
        min_real_data: Minimum number of real accommodations before using mock data
    
    Returns:
        List of accommodations (real + mock if needed)
    """
    # Fetch real accommodations from database
    real_accommodations = fetch_accommodations_from_db(
        budget_min=budget_min,
        budget_max=budget_max,
        district=district,
        province=province,
        amenities=required_amenities
    )
    
    print(f"Found {len(real_accommodations)} real accommodations from database")
    
    # If insufficient real data, supplement with mock data
    if len(real_accommodations) < min_real_data:
        print(f"Insufficient real data ({len(real_accommodations)} < {min_real_data}), adding mock data")
        
        # Load mock accommodations
        mock_accommodations = load_accommodations('data/mock_accommodations.json')
        
        # Mark mock data as not in system
        for acc in mock_accommodations:
            acc['in_system'] = False
        
        # Combine real and mock
        all_accommodations = real_accommodations + mock_accommodations
    else:
        all_accommodations = real_accommodations
    
    return all_accommodations


@app.route('/api/recommendations/accommodations', methods=['POST'])
def recommend_accommodations():
    """
    Generate accommodation recommendations based on user preferences.
    
    Expected JSON body:
    {
        "budget_min": 5000.0,
        "budget_max": 15000.0,
        "required_amenities": ["wifi", "pool"],
        "interests": ["coastal", "luxury"],
        "travel_style": "luxury",
        "group_size": 2,
        "accommodation_type": "hotel",
        "district": "Colombo",
        "province": "Western",
        "city_only": false,
        "top_k": 10
    }
    
    Returns:
        JSON response with recommendations
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Extract parameters with defaults
        budget_min = data.get('budget_min', 1000.0)
        budget_max = data.get('budget_max', 50000.0)
        required_amenities = data.get('required_amenities', [])
        interests = data.get('interests', [])
        travel_style = data.get('travel_style', 'budget')
        group_size = data.get('group_size', 1)
        accommodation_type = data.get('accommodation_type', 'any')
        district = data.get('district')
        province = data.get('province')
        city_only = data.get('city_only', False)
        top_k = data.get('top_k', 10)
        
        # Get hybrid accommodations (real + mock if needed)
        accommodations = get_hybrid_accommodations(
            budget_min=budget_min,
            budget_max=budget_max,
            required_amenities=required_amenities,
            district=district,
            province=province
        )
        
        if not accommodations:
            return jsonify({
                "recommendations": [],
                "total_candidates": 0,
                "message": "No accommodations found. Try adjusting your filters."
            }), 200
        
        # Initialize recommender with hybrid data
        recommender = AccommodationRecommender(accommodations)
        
        # Generate recommendations
        results = recommender.recommend(
            budget_min=budget_min,
            budget_max=budget_max,
            required_amenities=required_amenities,
            interests=interests,
            travel_style=travel_style,
            group_size=group_size,
            accommodation_type=accommodation_type,
            district=district,
            province=province,
            city_only=city_only,
            top_k=top_k
        )
        
        # Add in_system flag to recommendations
        for rec in results['recommendations']:
            # Find the original accommodation to get in_system flag
            acc_id = rec['id']
            for acc in accommodations:
                if acc['id'] == acc_id:
                    rec['in_system'] = acc.get('in_system', False)
                    break
        
        return jsonify(results), 200
    
    except Exception as e:
        print(f"Error in recommend_accommodations: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


def fetch_guides_from_db(
    budget_min: Optional[float] = None,
    budget_max: Optional[float] = None,
    city: Optional[str] = None,
    province: Optional[str] = None,
    languages: Optional[List[str]] = None
) -> List[Dict]:
    """Fetch guides from PostgreSQL database."""
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        query = """
            SELECT 
                g.user_id as id,
                u.name,
                g.experience,
                g.languages,
                g.expertise,
                g.rating,
                g.price,
                g.availability,
                g.city,
                g.province,
                g.gender
            FROM guides g
            LEFT JOIN users u ON g.user_id = u.id
            WHERE 1=1
        """
        params = []
        
        if budget_min is not None and budget_max is not None:
            query += " AND (g.price >= %s AND g.price <= %s)"
            params.extend([budget_min, budget_max])
        
        if city:
            query += " AND g.city = %s"
            params.append(city)
        
        if province:
            query += " AND g.province = %s"
            params.append(province)
        
        cur.execute(query, params)
        results = cur.fetchall()
        
        guides = []
        for row in results:
            guide = {
                'id': row['id'],
                'user_id': row['id'],
                'name': row['name'],
                'experience': row.get('experience') or [],
                'languages': row.get('languages') or [],
                'expertise': row.get('expertise') or [],
                'rating': row.get('rating'),
                'price': row.get('price') or 0,
                'availability': row.get('availability', True),
                'city': row.get('city'),
                'province': row.get('province'),
                'gender': row.get('gender'),
                'in_system': True
            }
            print(f"DEBUG: Fetched guide {guide['name']} with price {guide['price']} (type: {type(guide['price'])})")
            guides.append(guide)
        
        print(f"DEBUG: Total guides fetched from DB: {len(guides)}")
        return guides
    finally:
        cur.close()
        conn.close()


def get_hybrid_guides(
    budget_min: float,
    budget_max: float,
    languages: List[str],
    city: Optional[str] = None,
    province: Optional[str] = None,
    min_real_data: int = 5
) -> List[Dict]:
    """Get guides with hybrid approach: real DB data + mock data fallback."""
    real_guides = fetch_guides_from_db(
        budget_min=budget_min,
        budget_max=budget_max,
        city=city,
        province=province,
        languages=languages
    )
    
    print(f"Found {len(real_guides)} real guides from database")
    
    if len(real_guides) < min_real_data:
        print(f"Insufficient real data ({len(real_guides)} < {min_real_data}), adding mock data")
        
        with open('data/mock_guides.json', 'r', encoding='utf-8') as f:
            mock_guides = json.load(f)
        
        for guide in mock_guides:
            guide['in_system'] = False
        
        all_guides = real_guides + mock_guides
    else:
        all_guides = real_guides
    
    return all_guides


@app.route('/api/recommendations/guides', methods=['POST'])
def recommend_guides():
    """Generate guide recommendations based on user preferences."""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        budget_min = data.get('budget_min', 2000.0)
        budget_max = data.get('budget_max', 20000.0)
        languages = data.get('languages', ["English"])
        expertise = data.get('expertise', [])
        city = data.get('city')
        province = data.get('province')
        city_only = data.get('city_only', False)
        gender_preference = data.get('gender_preference')
        top_k = data.get('top_k', 10)
        
        if not languages:
            return jsonify({"error": "At least one language is required"}), 400
        
        guides = get_hybrid_guides(
            budget_min=budget_min,
            budget_max=budget_max,
            languages=languages,
            city=city,
            province=province
        )
        
        if not guides:
            return jsonify({
                "recommendations": [],
                "total_candidates": 0,
                "message": "No guides found. Try adjusting your filters."
            }), 200
        
        recommender = GuideRecommender(guides)
        
        results = recommender.recommend(
            budget_min=budget_min,
            budget_max=budget_max,
            languages=languages,
            expertise=expertise,
            city=city,
            province=province,
            city_only=city_only,
            gender_preference=gender_preference,
            top_k=top_k
        )
        
        return jsonify(results), 200
    
    except Exception as e:
        print(f"Error in recommend_guides: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/api/match/guides', methods=['POST'])
def match_guides():
    """Alias endpoint for guide recommendations (deprecated, use /api/recommendations/guides)."""
    return recommend_guides()


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


if __name__ == '__main__':
    print(f"Starting Flask API on port {FLASK_PORT}")
    print(f"Database URL: {DATABASE_URL}")
    app.run(debug=True, host='0.0.0.0', port=FLASK_PORT)
