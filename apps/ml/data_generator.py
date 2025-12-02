"""
Mock data generator for accommodation recommendation system.
Generates 1000 realistic accommodation records for testing ML algorithms.
"""

import json
import random
import uuid
from typing import List, Dict

# Sri Lankan provinces and major cities
PROVINCES = {
    "Western": ["Colombo", "Gampaha", "Negombo", "Kalutara"],
    "Southern": ["Galle", "Matara", "Tangalle", "Mirissa", "Hikkaduwa"],
    "Central": ["Kandy", "Nuwara Eliya", "Dambulla", "Sigiriya"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar"],
    "Eastern": ["Trincomalee", "Batticaloa", "Arugam Bay"],
    "North Western": ["Kurunegala", "Puttalam", "Kalpitiya"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "Uva": ["Badulla", "Ella", "Bandarawela"],
    "Sabaragamuwa": ["Ratnapura", "Kegalle"],
}

# Accommodation types
TYPES = ["hotel", "villa", "guesthouse", "resort", "hostel", "boutique_hotel", "eco_lodge"]

# Amenities
AMENITIES = [
    "wifi", "hot_water", "pool", "parking", "restaurant", "bar", 
    "gym", "spa", "beach_access", "garden", "air_conditioning",
    "room_service", "laundry", "airport_shuttle", "terrace", "bbq"
]

# Interests/Tags
INTERESTS = [
    "coastal", "adventure", "cultural", "wildlife", "wellness",
    "luxury", "budget_friendly", "eco_friendly", "romantic", "family_friendly",
    "photography", "hiking", "surfing", "diving", "historical"
]

# Travel styles
TRAVEL_STYLES = [
    "luxury", "budget", "family", "solo", "adventure", 
    "romantic", "cultural", "relaxation", "eco_tourism", "business"
]


def generate_accommodation_name(location: str, accommodation_type: str) -> str:
    """Generate a realistic accommodation name."""
    prefixes = ["The", "Grand", "Royal", "Paradise", "Ocean", "Hill", "Palm", "Green", "Blue", "Golden"]
    suffixes = ["Resort", "Hotel", "Villa", "Retreat", "Lodge", "Inn", "Guesthouse", "Hideaway"]
    
    if accommodation_type == "hostel":
        return f"{random.choice(['Backpacker', 'Traveler', 'Explorer'])} {location} Hostel"
    elif accommodation_type == "eco_lodge":
        return f"{location} {random.choice(['Eco', 'Nature', 'Green'])} Lodge"
    else:
        return f"{random.choice(prefixes)} {location} {random.choice(suffixes)}"


def generate_mock_accommodations(count: int = 1000) -> List[Dict]:
    """
    Generate mock accommodation data for testing the recommendation system.
    
    Args:
        count: Number of accommodations to generate (default: 1000)
    
    Returns:
        List of accommodation dictionaries
    """
    accommodations = []
    
    for i in range(count):
        # Select province and city
        province = random.choice(list(PROVINCES.keys()))
        city = random.choice(PROVINCES[province])
        
        # Select accommodation type (weighted towards popular types)
        accom_type = random.choices(
            TYPES,
            weights=[25, 15, 20, 20, 10, 5, 5],  # Hotels and resorts more common
            k=1
        )[0]
        
        # Generate price range based on type
        if accom_type == "hostel":
            price_min = random.randint(500, 1500)
            price_max = price_min + random.randint(500, 1000)
        elif accom_type in ["resort", "villa", "boutique_hotel"]:
            price_min = random.randint(5000, 15000)
            price_max = price_min + random.randint(5000, 20000)
        else:
            price_min = random.randint(2000, 8000)
            price_max = price_min + random.randint(2000, 8000)
        
        # Select amenities (3-8 amenities per accommodation)
        num_amenities = random.randint(3, 8)
        selected_amenities = random.sample(AMENITIES, num_amenities)
        
        # Basic amenities for all
        if "wifi" not in selected_amenities and random.random() > 0.2:
            selected_amenities.append("wifi")
        if "hot_water" not in selected_amenities and random.random() > 0.1:
            selected_amenities.append("hot_water")
        
        # Select interests (2-5 tags)
        num_interests = random.randint(2, 5)
        selected_interests = random.sample(INTERESTS, num_interests)
        
        # Coastal locations get coastal tag
        if city in ["Galle", "Mirissa", "Hikkaduwa", "Negombo", "Trincomalee", "Arugam Bay", "Tangalle"]:
            if "coastal" not in selected_interests:
                selected_interests.append("coastal")
        
        # Hill country gets hiking/photography tags
        if city in ["Nuwara Eliya", "Ella", "Kandy", "Badulla"]:
            if "hiking" not in selected_interests and random.random() > 0.5:
                selected_interests.append("hiking")
        
        # Select travel styles (1-3 styles)
        num_styles = random.randint(1, 3)
        selected_styles = random.sample(TRAVEL_STYLES, num_styles)
        
        # Group size (capacity)
        if accom_type in ["resort", "hotel"]:
            group_size = random.randint(2, 20)
        elif accom_type == "villa":
            group_size = random.randint(4, 12)
        elif accom_type == "hostel":
            group_size = random.randint(1, 8)
        else:
            group_size = random.randint(2, 6)
        
        # Rating (weighted towards higher ratings)
        rating = round(random.triangular(2.5, 5.0, 4.2), 1)
        
        # Prior bookings (log-normal distribution)
        prior_bookings = int(random.lognormvariate(3, 1.5))
        prior_bookings = min(prior_bookings, 500)  # Cap at 500
        
        accommodation = {
            "id": str(uuid.uuid4()),
            "name": generate_accommodation_name(city, accom_type),
            "provider_id": str(uuid.uuid4()),
            "type": [accom_type],
            "amenities": selected_amenities,
            "rating": rating,
            "location": city,
            "price_range_min": float(price_min),
            "price_range_max": float(price_max),
            "province": province,
            "interests": selected_interests,
            "travel_style": selected_styles,
            "group_size": group_size,
            "prior_bookings": prior_bookings,
            "availability": random.random() > 0.1,  # 90% available
        }
        
        accommodations.append(accommodation)
    
    return accommodations


def save_mock_data(accommodations: List[Dict], filename: str = "mock_accommodations.json"):
    """Save generated accommodations to JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(accommodations, f, indent=2, ensure_ascii=False)
    print(f"✓ Generated {len(accommodations)} accommodations")
    print(f"✓ Saved to {filename}")


def print_statistics(accommodations: List[Dict]):
    """Print statistics about generated data."""
    print("\n=== Data Statistics ===")
    
    # Province distribution
    province_counts = {}
    for acc in accommodations:
        prov = acc["province"]
        province_counts[prov] = province_counts.get(prov, 0) + 1
    print(f"\nProvince distribution:")
    for prov, count in sorted(province_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {prov}: {count}")
    
    # Type distribution
    type_counts = {}
    for acc in accommodations:
        for t in acc["type"]:
            type_counts[t] = type_counts.get(t, 0) + 1
    print(f"\nType distribution:")
    for typ, count in sorted(type_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {typ}: {count}")
    
    # Price range
    prices = [acc["price_range_min"] for acc in accommodations]
    print(f"\nPrice range (min):")
    print(f"  Min: {min(prices):.0f} LKR")
    print(f"  Max: {max(prices):.0f} LKR")
    print(f"  Average: {sum(prices)/len(prices):.0f} LKR")
    
    # Rating distribution
    ratings = [acc["rating"] for acc in accommodations]
    print(f"\nRating distribution:")
    print(f"  Min: {min(ratings):.1f}")
    print(f"  Max: {max(ratings):.1f}")
    print(f"  Average: {sum(ratings)/len(ratings):.2f}")
    
    # Availability
    available = sum(1 for acc in accommodations if acc["availability"])
    print(f"\nAvailability:")
    print(f"  Available: {available} ({available/len(accommodations)*100:.1f}%)")


if __name__ == "__main__":
    print("Generating mock accommodation data...")
    accommodations = generate_mock_accommodations(1000)
    save_mock_data(accommodations)
    print_statistics(accommodations)
    print("\n✓ Mock data generation complete!")
