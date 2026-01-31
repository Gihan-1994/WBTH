"""
Debug script to test the location filter with your exact scenario.
"""
import os
import sys
from dotenv import load_dotenv

# Add parent directory to sys.path to find recommender.py
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if base_dir not in sys.path:
    sys.path.append(base_dir)

from recommender import AccommodationRecommender, load_accommodations

load_dotenv()

# Load mock data
print("Loading mock accommodations...")
data_path = os.path.join(base_dir, 'data/mock_accommodations.json')
accommodations = load_accommodations(data_path)
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
    district="Matara",
    province="Southern",
    city_only=True,  # This should enforce ONLY Matara
    top_k=10
)

print(f"\nTotal candidates after hard filters: {results['total_candidates']}")
print(f"Recommendations returned: {len(results['recommendations'])}\n")

if results['recommendations']:
    print("Top 5 Results:")
    for i, rec in enumerate(results['recommendations'][:5], 1):
        print(f"\n{i}. {rec['name']}")
        print(f"   📍 {rec['district']}, {rec['province']}")
        print(f"   Score: {rec['score']:.3f}")
        
        # Check if location is correct
        if rec['district'].lower() != "matara":
            print(f"   ⚠️  ERROR: Should be Matara, but got {rec['district']}!")
        else:
            print(f"   ✅ Correct location")
else:
    print("No recommendations found")

print("\n" + "=" * 60)
