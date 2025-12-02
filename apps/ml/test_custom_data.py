"""
Custom Data Testing Script for Recommendation System

Instructions:
1. Add your own accommodations in the CUSTOM_ACCOMMODATIONS list below
2. Define your search query in the USER_QUERY section
3. Run: ./venv/bin/python test_custom_data.py
"""
from recommender import AccommodationRecommender
import json

# ============================================================================
# STEP 1: LOAD DATA
# ============================================================================
# Option A: Load 1000 mock accommodations (CURRENT)
with open('mock_accommodations.json', 'r') as f:
    CUSTOM_ACCOMMODATIONS = json.load(f)

# Option B: Use custom accommodations (COMMENTED OUT)
# Uncomment below and comment out the lines above to use your own data
"""
CUSTOM_ACCOMMODATIONS = [
    {
        "id": "my-resort-1",
        "name": "My Dream Beach Resort",
        "location": "Unawatuna",
        "province": "Southern",
        "price_range_min": 15000.0,
        "price_range_max": 30000.0,
        "amenities": ["wifi", "pool", "beach_access", "spa", "restaurant"],
        "interests": ["coastal", "luxury", "romantic"],
        "travel_style": ["luxury", "romantic", "relaxation"],
        "group_size": 12,
        "rating": 4.8,
        "prior_bookings": 150,
        "availability": True
    },
    # Add more accommodations here...
]
"""


# ============================================================================
# REFERENCE: Available Options
# ============================================================================

"""
Available Provinces:
  - Western, Southern, Central, Northern, Eastern
  - North Western, North Central, Uva, Sabaragamuwa

Available Cities (examples):
  - Colombo, Galle, Kandy, Ella, Mirissa
  - Negombo, Trincomalee, Jaffna, Nuwara Eliya

Available Amenities:
  - wifi, hot_water, pool, parking, restaurant, bar
  - gym, spa, beach_access, garden, air_conditioning
  - room_service, laundry, airport_shuttle, terrace, bbq

Available Interests:
  - coastal, adventure, cultural, wildlife, wellness
  - luxury, budget_friendly, eco_friendly, romantic
  - family_friendly, photography, hiking, surfing, diving, historical

Available Travel Styles:
  - luxury, budget, family, solo, adventure
  - romantic, cultural, relaxation, eco_tourism, business
"""

# ============================================================================
# STEP 2: DEFINE YOUR SEARCH QUERY
# ============================================================================

USER_QUERY = {
    "budget_min": 1500,           # Minimum budget (LKR)
    "budget_max": 8000,          # Maximum budget (LKR)
    "required_amenities": ["wifi", "pool"],  # Must have these
    "interests": ["coastal", "romantic"],    # Your interests
    "travel_style": "",              # Your travel style
    "group_size": 2,                         # Number of people
    "location_city": "Colombo",                # Preferred city (optional)
    "location_province": "Western",         # Preferred province (optional)
    "city_only": False,          # True = only show city, False = province OK
    "top_k": 5                   # Number of recommendations
}

# ============================================================================
# STEP 3: RUN THE RECOMMENDER
# ============================================================================

def main():
    print("=" * 70)
    print("CUSTOM DATA RECOMMENDATION TEST")
    print("=" * 70)
    print()
    
    # Show your data
    print(f"📊 Your Custom Data:")
    print(f"   Total Accommodations: {len(CUSTOM_ACCOMMODATIONS)}")
    print()
    for i, acc in enumerate(CUSTOM_ACCOMMODATIONS, 1):
        print(f"   {i}. {acc['name']}")
        print(f"      Location: {acc['location']}, {acc['province']}")
        print(f"      Price: {acc['price_range_min']:.0f}-{acc['price_range_max']:.0f} LKR")
        print(f"      Rating: {acc['rating']}/5.0")
        print()
    
    # Show your query
    print("-" * 70)
    print(f"🔍 Your Search Query:")
    print(f"   Budget: {USER_QUERY['budget_min']:.0f}-{USER_QUERY['budget_max']:.0f} LKR")
    print(f"   Group Size: {USER_QUERY['group_size']} people")
    print(f"   Required Amenities: {', '.join(USER_QUERY['required_amenities'])}")
    print(f"   Interests: {', '.join(USER_QUERY['interests'])}")
    print(f"   Travel Style: {USER_QUERY['travel_style']}")
    if USER_QUERY.get('location_city'):
        print(f"   Preferred Location: {USER_QUERY['location_city']}, {USER_QUERY['location_province']}")
    print()
    
    # Create recommender
    print("-" * 70)
    print("🤖 Running Recommendation Engine...")
    print()
    
    recommender = AccommodationRecommender(CUSTOM_ACCOMMODATIONS)
    results = recommender.recommend(**USER_QUERY)
    
    # Display results
    if results["recommendations"]:
        print(f"✅ Found {results['total_candidates']} matching accommodations")
        print(f"\n🎯 Top {len(results['recommendations'])} Recommendations:")
        print()
        
        for i, rec in enumerate(results["recommendations"], 1):
            print(f"{i}. {rec['name']}")
            print(f"   📍 {rec['location']}, {rec['province']}")
            print(f"   💰 {rec['price_range_min']:.0f}-{rec['price_range_max']:.0f} LKR")
            print(f"   ⭐ Rating: {rec['rating']}/5.0")
            print(f"   📊 Score: {rec['score']:.3f}")
            print(f"   💡 Why recommended:")
            for reason in rec['reasons']:
                print(f"      • {reason}")
            print()
    else:
        print("❌ No accommodations match your criteria")
        print()
        print("Filters applied:")
        for f in results["filters_applied"]:
            print(f"   • {f}")
        print()
        print("💡 Try:")
        print("   - Increasing budget range")
        print("   - Removing some required amenities")
        print("   - Expanding location (set city_only=False)")
        print("   - Adding more accommodations to your list")
    
    print("=" * 70)


if __name__ == "__main__":
    main()
