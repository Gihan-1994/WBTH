"""
Debug script to test the location filter with your exact scenario.
"""
import os
import sys
from dotenv import load_dotenv
from recommender import AccommodationRecommender, load_accommodations

load_dotenv()

# Load mock data
print("Loading mock accommodations...")
accommodations = load_accommodations('../data/mock_accommodations.json')
print(f"Loaded {len(accommodations)} accommodations\n")

# Initialize recommender
recommender = AccommodationRecommender(accommodations)

# Test with your exact filters
print("=" * 60)
print("Testing: Matara with city_only=True")
print("=" * 60)

results = recommender.recommend(
    budget_min=0,
    budget_max=2000,
    required_amenities=[],
    interests=[],
    travel_style="luxury",
    group_size=1,
    accommodation_type="any",
    location_city="Matara",
    location_province="Southern",
    city_only=True,  # This should enforce ONLY Matara
    top_k=10
)

print(f"\nTotal candidates after hard filters: {results['total_candidates']}")
print(f"Recommendations returned: {len(results['recommendations'])}\n")

if results['recommendations']:
    print("Top 5 Results:")
    for i, rec in enumerate(results['recommendations'][:5], 1):
        print(f"\n{i}. {rec['name']}")
        print(f"   📍 {rec['location']}, {rec['province']}")
        print(f"   Score: {rec['score']:.3f}")
        
        # Check if location is correct
        if rec['location'].lower() != "matara":
            print(f"   ⚠️  ERROR: Should be Matara, but got {rec['location']}!")
        else:
            print(f"   ✅ Correct location")
else:
    print("No recommendations found")

print("\n" + "=" * 60)
