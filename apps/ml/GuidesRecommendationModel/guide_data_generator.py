"""
Mock data generator for guide recommendation system.
Generates 1000 realistic guide records for testing ML algorithms.
"""

import json
import random
import uuid
from typing import List, Dict

# Sri Lankan provinces and major cities (matching accommodation data)
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

# Languages spoken by guides
LANGUAGES = [
    "English", "Sinhala", "Tamil", "French", "German", 
    "Japanese", "Chinese", "Spanish", "Italian", "Russian"
]

# Areas of expertise/specialization
EXPERTISE = [
    "Wildlife", "Cultural", "Adventure", "Historical", "Photography",
    "Surfing", "Diving", "Hiking", "Tea Plantation", "Ayurveda",
    "Bird Watching", "Food Tours", "Religious Sites", "Beach Activities",
    "Nature Trails", "City Tours", "Shopping", "Whale Watching"
]

# First names (mix of Sinhala, Tamil, and international)
FIRST_NAMES = [
    "Nimal", "Saman", "Kamal", "Priya", "Sandun", "Chatura", "Dilshan",
    "Tharindu", "Chaminda", "Asanka", "Nuwan", "Kasun", "Ruwan", "Mahesh",
    "Kumar", "Ravi", "Sunil", "Anil", "Prasad", "Dinesh", "Roshan",
    "Lakshmi", "Nalini", "Amali", "Thilini", "Chathurika", "Nadeeka"
]

# Last names
LAST_NAMES = [
    "Silva", "Fernando", "Perera", "Jayawardena", "Wickramasinghe",
    "Gunasekara", "Rajapakse", "Amarasinghe", "Bandaranaike", "Dissanayake",
    "Wijesinghe", "Karunaratne", "De Silva", "Jayasuriya", "Mendis"
]

# Gender distribution
GENDERS = ["male", "female"]


def generate_guide_name() -> str:
    """Generate a realistic guide name."""
    return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"


def generate_mock_guides(count: int = 1000) -> List[Dict]:
    """
    Generate mock guide data for testing the recommendation system.
    
    Args:
        count: Number of guides to generate (default: 1000)
    
    Returns:
        List of guide dictionaries
    """
    guides = []
    
    for i in range(count):
        # Select province and city
        province = random.choice(list(PROVINCES.keys()))
        city = random.choice(PROVINCES[province])
        
        # Gender distribution: ~70% male, ~30% female (realistic for tourism industry)
        gender = random.choices(GENDERS, weights=[70, 30], k=1)[0]
        
        # Languages (1-4 languages, English is very common)
        num_languages = random.randint(1, 4)
        selected_languages = random.sample(LANGUAGES, num_languages)
        
        # Ensure English is included in 90% of guides
        if "English" not in selected_languages and random.random() > 0.1:
            selected_languages.append("English")
        
        # Sinhala/Tamil based on region
        if province in ["Northern", "Eastern"]:
            if "Tamil" not in selected_languages and random.random() > 0.3:
                selected_languages.append("Tamil")
        else:
            if "Sinhala" not in selected_languages and random.random() > 0.2:
                selected_languages.append("Sinhala")
        
        # Expertise (2-5 specializations)
        num_expertise = random.randint(2, 5)
        selected_expertise = random.sample(EXPERTISE, num_expertise)
        
        # Location-specific expertise
        if city in ["Galle", "Mirissa", "Hikkaduwa", "Arugam Bay"]:
            # Coastal areas
            beach_expertise = ["Surfing", "Diving", "Whale Watching", "Beach Activities"]
            if not any(e in selected_expertise for e in beach_expertise):
                selected_expertise.append(random.choice(beach_expertise))
        
        if city in ["Yala", "Wilpattu", "Trincomalee", "Arugam Bay"]:
            # Wildlife areas
            if "Wildlife" not in selected_expertise and random.random() > 0.3:
                selected_expertise.append("Wildlife")
        
        if city in ["Kandy", "Anuradhapura", "Polonnaruwa", "Sigiriya"]:
            # Cultural/historical areas
            cultural_expertise = ["Cultural", "Historical", "Religious Sites"]
            if not any(e in selected_expertise for e in cultural_expertise):
                selected_expertise.append(random.choice(cultural_expertise))
        
        if city in ["Nuwara Eliya", "Ella", "Badulla"]:
            # Hill country
            hill_expertise = ["Hiking", "Tea Plantation", "Nature Trails"]
            if not any(e in selected_expertise for e in hill_expertise):
                selected_expertise.append(random.choice(hill_expertise))
        
        # Experience (years in different areas)
        num_experience_areas = random.randint(1, 3)
        experience_list = []
        for _ in range(num_experience_areas):
            years = random.randint(1, 15)
            area = random.choice(selected_expertise)
            experience_list.append(f"{years} years in {area}")
        
        # Price per day (2000 - 20000 LKR)
        # More experienced guides and those with specialized expertise charge more
        base_price = random.randint(2000, 8000)
        
        # Price adjustments
        if len(selected_languages) >= 3:
            base_price += 2000  # Multilingual bonus
        if len(selected_expertise) >= 4:
            base_price += 1500  # Specialized expertise bonus
        if any("Photography" in exp or "Ayurveda" in exp for exp in selected_expertise):
            base_price += 2000  # Specialized skills bonus
        
        price = min(base_price, 20000)  # Cap at 20000
        
        # Rating (weighted towards higher ratings)
        rating = round(random.triangular(3.0, 5.0, 4.3), 1)
        
        # Prior bookings (log-normal distribution)
        prior_bookings = int(random.lognormvariate(2.5, 1.3))
        prior_bookings = min(prior_bookings, 300)  # Cap at 300
        
        # Availability (80% available)
        availability = random.random() > 0.2
        
        guide = {
            "id": str(uuid.uuid4()),
            "user_id": str(uuid.uuid4()),
            "name": generate_guide_name(),
            "gender": gender,
            "city": city,
            "province": province,
            "languages": selected_languages,
            "expertise": selected_expertise,
            "experience": experience_list,
            "price": float(price),
            "rating": rating,
            "prior_bookings": prior_bookings,
            "availability": availability,
        }
        
        guides.append(guide)
    
    return guides


def save_mock_data(guides: List[Dict], filename: str = "mock_guides.json"):
    """Save generated guides to JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(guides, f, indent=2, ensure_ascii=False)
    print(f"✓ Generated {len(guides)} guides")
    print(f"✓ Saved to {filename}")


def print_statistics(guides: List[Dict]):
    """Print statistics about generated data."""
    print("\n=== Data Statistics ===")
    
    # Province distribution
    province_counts = {}
    for guide in guides:
        prov = guide["province"]
        province_counts[prov] = province_counts.get(prov, 0) + 1
    print(f"\nProvince distribution:")
    for prov, count in sorted(province_counts.items(), key=lambda x: x[1], reverse=True):
        print(f"  {prov}: {count}")
    
    # Gender distribution
    gender_counts = {}
    for guide in guides:
        gender = guide["gender"]
        gender_counts[gender] = gender_counts.get(gender, 0) + 1
    print(f"\nGender distribution:")
    for gender, count in gender_counts.items():
        print(f"  {gender}: {count} ({count/len(guides)*100:.1f}%)")
    
    # Language distribution (top 10)
    language_counts = {}
    for guide in guides:
        for lang in guide["languages"]:
            language_counts[lang] = language_counts.get(lang, 0) + 1
    print(f"\nTop languages:")
    for lang, count in sorted(language_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {lang}: {count}")
    
    # Expertise distribution (top 10)
    expertise_counts = {}
    for guide in guides:
        for exp in guide["expertise"]:
            expertise_counts[exp] = expertise_counts.get(exp, 0) + 1
    print(f"\nTop expertise:")
    for exp, count in sorted(expertise_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"  {exp}: {count}")
    
    # Price range
    prices = [guide["price"] for guide in guides]
    print(f"\nPrice range (per day):")
    print(f"  Min: {min(prices):.0f} LKR")
    print(f"  Max: {max(prices):.0f} LKR")
    print(f"  Average: {sum(prices)/len(prices):.0f} LKR")
    
    # Rating distribution
    ratings = [guide["rating"] for guide in guides]
    print(f"\nRating distribution:")
    print(f"  Min: {min(ratings):.1f}")
    print(f"  Max: {max(ratings):.1f}")
    print(f"  Average: {sum(ratings)/len(ratings):.2f}")
    
    # Availability
    available = sum(1 for guide in guides if guide["availability"])
    print(f"\nAvailability:")
    print(f"  Available: {available} ({available/len(guides)*100:.1f}%)")
    print(f"  Unavailable: {len(guides)-available} ({(len(guides)-available)/len(guides)*100:.1f}%)")


if __name__ == "__main__":
    print("Generating mock guide data...")
    guides = generate_mock_guides(1000)
    save_mock_data(guides, "../data/mock_guides.json")
    print_statistics(guides)
    print("\n✓ Mock data generation complete!")
