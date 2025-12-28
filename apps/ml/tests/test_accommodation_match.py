"""
Test script to fetch a specific accommodation and test ML recommendations.
"""
import os
import json
import requests
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
FLASK_PORT = os.getenv('FLASK_PORT', '5001')

def fetch_accommodation(accommodation_id: str):
    """Fetch accommodation details from database."""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    query = """
        SELECT 
            id, name, district, province, 
            price_range_min, price_range_max,
            type, amenities, interests, travel_style, 
            group_size, rating
        FROM accommodations 
        WHERE id = %s
    """
    
    cur.execute(query, (accommodation_id,))
    result = cur.fetchone()
    
    cur.close()
    conn.close()
    
    return dict(result) if result else None

def test_recommendations(accommodation):
    """Test recommendations using accommodation's exact data."""
    if not accommodation:
        print("❌ Accommodation not found!")
        return
    
    print("\n" + "="*80)
    print("🏨 ACCOMMODATION DETAILS")
    print("="*80)
    print(f"ID: {accommodation['id']}")
    print(f"Name: {accommodation['name']}")
    print(f"District: {accommodation['district']}")
    print(f"Province: {accommodation['province']}")
    print(f"Price Range: ${accommodation['price_range_min']} - ${accommodation['price_range_max']}")
    print(f"Type: {accommodation['type']}")
    print(f"Amenities: {accommodation['amenities']}")
    print(f"Interests: {accommodation['interests']}")
    print(f"Travel Style: {accommodation['travel_style']}")
    print(f"Group Size: {accommodation['group_size']}")
    print(f"Rating: {accommodation['rating']}")
    
    # Prepare recommendation request matching this accommodation's profile
    request_data = {
        "budget_min": accommodation['price_range_min'] or 0,
        "budget_max": accommodation['price_range_max'] or 100000,
        "required_amenities": accommodation['amenities'] or [],
        "interests": accommodation['interests'] or [],
        "travel_style": accommodation['travel_style'][0] if accommodation['travel_style'] else "budget",
        "group_size": accommodation['group_size'] or 1,
        "accommodation_type": accommodation['type'][0] if accommodation['type'] else "any",
        "district": accommodation['district'],
        "province": accommodation['province'],
        "city_only": False,
        "top_k": 10
    }
    
    print("\n" + "="*80)
    print("📊 RECOMMENDATION REQUEST")
    print("="*80)
    print(json.dumps(request_data, indent=2))
    
    # Call ML API
    print("\n" + "="*80)
    print("🤖 CALLING ML RECOMMENDATION API...")
    print("="*80)
    
    try:
        response = requests.post(
            f"http://localhost:{FLASK_PORT}/api/recommendations/accommodations",
            json=request_data,
            timeout=30
        )
        
        if response.status_code == 200:
            results = response.json()
            recommendations = results.get('recommendations', [])
            
            print(f"\n✅ SUCCESS! Received {len(recommendations)} recommendations")
            print(f"Total candidates evaluated: {results.get('total_candidates', 0)}")
            
            # Check if original accommodation is in recommendations
            original_found = False
            original_rank = None
            
            print("\n" + "="*80)
            print("🎯 TOP RECOMMENDATIONS")
            print("="*80)
            
            for i, rec in enumerate(recommendations[:10], 1):
                is_original = rec['id'] == accommodation['id']
                marker = "⭐ THIS ONE! ⭐" if is_original else ""
                
                print(f"\n#{i} - Score: {rec.get('score', 0):.2f} {marker}")
                print(f"   Name: {rec['name']}")
                print(f"   District: {rec.get('district', 'N/A')}")
                print(f"   Price: ${rec.get('price_range_min', 0)} - ${rec.get('price_range_max', 0)}")
                print(f"   Type: {rec.get('type', [])}")
                print(f"   Travel Style: {rec.get('travel_style', [])}")
                print(f"   Interests: {rec.get('interests', [])}")
                print(f"   Reasons:")
                for reason in rec.get('reasons', []):
                    print(f"      • {reason}")
                
                if is_original:
                    original_found = True
                    original_rank = i
            
            print("\n" + "="*80)
            print("📈 ANALYSIS")
            print("="*80)
            
            if original_found:
                print(f"✅ Original accommodation FOUND at rank #{original_rank}")
                print(f"   This shows the ML model correctly identifies similar accommodations!")
            else:
                print(f"❌ Original accommodation NOT in top {len(recommendations)} results")
                print(f"   This might indicate the scoring algorithm needs tuning")
        
        else:
            print(f"❌ API Error: {response.status_code}")
            print(response.text)
    
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    accommodation_id = "ec4f3f66-1939-4733-8306-eaaf8fa5ab1f"
    
    print(f"🔍 Fetching accommodation: {accommodation_id}")
    accommodation = fetch_accommodation(accommodation_id)
    
    test_recommendations(accommodation)
