# ML Data Generation Mechanism

## Overview

This document explains the mock data generation mechanism used in the accommodation recommendation system. The data generator creates 1000 realistic accommodation records for testing the ML recommendation algorithm without requiring a live database.

---

## Table of Contents

1. [Architecture & Design](#architecture--design)
2. [Data Schema](#data-schema)
3. [Generation Strategy](#generation-strategy)
4. [Code Walkthrough](#code-walkthrough)
5. [Statistical Distributions](#statistical-distributions)
6. [Examples](#examples)

---

## Architecture & Design

### Purpose
The data generator creates **realistic** mock accommodations that:
- Match the Prisma schema structure
- Reflect real-world Sri Lankan tourism patterns
- Provide diverse test cases for the recommendation algorithm
- Enable offline testing without database dependencies

### Design Principles
1. **Realism**: Data distributions match actual tourism patterns
2. **Diversity**: Wide variety of types, locations, and price ranges
3. **Consistency**: Logical relationships (e.g., resorts have pools, hostels are cheap)
4. **Completeness**: All fields required by the recommendation algorithm

---

## Data Schema

Each accommodation record contains:

```python
{
    "id": "UUID",                          # Unique identifier
    "name": "String",                      # Generated name
    "provider_id": "UUID",                 # Provider reference
    "type": ["String"],                    # Accommodation types
    "amenities": ["String"],               # Available amenities
    "rating": Float,                       # 1.0 - 5.0
    "location": "String",                  # City name
    "price_range_min": Float,              # Minimum price (LKR)
    "price_range_max": Float,              # Maximum price (LKR)
    "province": "String",                  # Sri Lankan province
    "interests": ["String"],               # Interest tags
    "travel_style": ["String"],            # Travel style tags
    "group_size": Integer,                 # Maximum capacity
    "prior_bookings": Integer,             # Historical bookings
    "availability": Boolean                # Currently available
}
```

---

## Generation Strategy

### 1. Location Selection

**Sri Lankan Geography**:
```python
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
```

**Selection Process**:
1. Random province selection (uniform distribution)
2. Random city within selected province
3. Results in realistic geographic distribution

**Example**:
```python
# Step 1: Select province
province = random.choice(list(PROVINCES.keys()))
# → "Southern"

# Step 2: Select city within province
city = random.choice(PROVINCES[province])
# → "Galle"
```

---

### 2. Accommodation Type Selection

**Types with Weighted Distribution**:
```python
TYPES = ["hotel", "villa", "guesthouse", "resort", "hostel", 
         "boutique_hotel", "eco_lodge"]

# Weighted selection (hotels and resorts more common)
accom_type = random.choices(
    TYPES,
    weights=[25, 15, 20, 20, 10, 5, 5],  # Percentage weights
    k=1
)[0]
```

**Distribution Breakdown**:
- Hotels: 25% (~250 accommodations)
- Resorts: 20% (~200 accommodations)
- Guesthouses: 20% (~200 accommodations)
- Villas: 15% (~150 accommodations)
- Hostels: 10% (~100 accommodations)
- Boutique Hotels: 5% (~50 accommodations)
- Eco Lodges: 5% (~50 accommodations)

---

### 3. Price Range Generation

**Type-Based Pricing**:
```python
if accom_type == "hostel":
    # Budget pricing
    price_min = random.randint(500, 1500)
    price_max = price_min + random.randint(500, 1000)
    
elif accom_type in ["resort", "villa", "boutique_hotel"]:
    # Luxury pricing
    price_min = random.randint(5000, 15000)
    price_max = price_min + random.randint(5000, 20000)
    
else:
    # Mid-range pricing
    price_min = random.randint(2000, 8000)
    price_max = price_min + random.randint(2000, 8000)
```

**Example Output**:
```python
# Hostel
{"price_range_min": 1200, "price_range_max": 1850}

# Resort
{"price_range_min": 12500, "price_range_max": 28000}

# Hotel
{"price_range_min": 5500, "price_range_max": 11200}
```

---

### 4. Amenities Selection

**Available Amenities**:
```python
AMENITIES = [
    "wifi", "hot_water", "pool", "parking", "restaurant", "bar", 
    "gym", "spa", "beach_access", "garden", "air_conditioning",
    "room_service", "laundry", "airport_shuttle", "terrace", "bbq"
]
```

**Selection Strategy**:
```python
# Random number of amenities (3-8)
num_amenities = random.randint(3, 8)
selected_amenities = random.sample(AMENITIES, num_amenities)

# Ensure essential amenities
if "wifi" not in selected_amenities and random.random() > 0.2:
    selected_amenities.append("wifi")  # 80% have wifi

if "hot_water" not in selected_amenities and random.random() > 0.1:
    selected_amenities.append("hot_water")  # 90% have hot water
```

**Example**:
```python
# Resort amenities
["wifi", "pool", "spa", "beach_access", "restaurant", "bar", "gym"]

# Hostel amenities
["wifi", "hot_water", "laundry"]

# Villa amenities
["wifi", "pool", "parking", "garden", "air_conditioning", "bbq"]
```

---

### 5. Interest Tags Assignment

**Interest Categories**:
```python
INTERESTS = [
    "coastal", "adventure", "cultural", "wildlife", "wellness",
    "luxury", "budget_friendly", "eco_friendly", "romantic", 
    "family_friendly", "photography", "hiking", "surfing", 
    "diving", "historical"
]
```

**Context-Aware Assignment**:
```python
# Base selection (2-5 tags)
num_interests = random.randint(2, 5)
selected_interests = random.sample(INTERESTS, num_interests)

# Location-based additions
if city in ["Galle", "Mirissa", "Hikkaduwa", "Negombo", "Trincomalee", "Arugam Bay"]:
    if "coastal" not in selected_interests:
        selected_interests.append("coastal")

# Hill country additions
if city in ["Nuwara Eliya", "Ella", "Kandy", "Badulla"]:
    if "hiking" not in selected_interests and random.random() > 0.5:
        selected_interests.append("hiking")
```

**Example**:
```python
# Accommodation in Galle
interests = ["coastal", "luxury", "romantic", "diving"]

# Accommodation in Ella
interests = ["adventure", "hiking", "photography", "eco_friendly"]

# Accommodation in Kandy
interests = ["cultural", "historical", "family_friendly"]
```

---

### 6. Travel Style Selection

**Travel Styles**:
```python
TRAVEL_STYLES = [
    "luxury", "budget", "family", "solo", "adventure", 
    "romantic", "cultural", "relaxation", "eco_tourism", "business"
]
```

**Selection**:
```python
# 1-3 styles per accommodation
num_styles = random.randint(1, 3)
selected_styles = random.sample(TRAVEL_STYLES, num_styles)
```

**Example**:
```python
# Resort
travel_style = ["luxury", "romantic", "relaxation"]

# Hostel
travel_style = ["budget", "solo"]

# Villa
travel_style = ["family", "luxury"]
```

---

### 7. Group Size Calculation

**Type-Based Capacity**:
```python
if accom_type in ["resort", "hotel"]:
    group_size = random.randint(2, 20)  # Large capacity
    
elif accom_type == "villa":
    group_size = random.randint(4, 12)  # Medium-large
    
elif accom_type == "hostel":
    group_size = random.randint(1, 8)   # Small-medium
    
else:
    group_size = random.randint(2, 6)   # Small
```

---

### 8. Rating Distribution

**Triangular Distribution** (weighted towards higher ratings):
```python
rating = round(random.triangular(2.5, 5.0, 4.2), 1)
```

**Distribution Curve**:
```
Frequency
    ^
    |           *
    |         * * *
    |       * * * * *
    |     * * * * * * *
    |   * * * * * * * * *
    | * * * * * * * * * * *
    +---+---+---+---+---+----> Rating
      2.5 3.0 3.5 4.0 4.5 5.0
                  ↑ Mode (most common)
```

**Why Triangular?**
- `min=2.5`: No extremely bad ratings
- `max=5.0`: Perfect ratings possible
- `mode=4.2`: Most cluster around 4.0-4.5 (realistic)

---

### 9. Prior Bookings (Popularity)

**Log-Normal Distribution**:
```python
prior_bookings = int(random.lognormvariate(3, 1.5))
prior_bookings = min(prior_bookings, 500)  # Cap at 500
```

**Why Log-Normal?**
- Most accommodations have low-medium bookings
- Few accommodations have very high bookings
- Matches real-world popularity distribution

**Distribution**:
```
Count
    ^
    |*
    |* *
    |* * *
    |* * * *
    |* * * * *
    |* * * * * * *
    +---+---+---+---+---+----> Prior Bookings
      0  50  100 150 200 250+
    ↑ Most common
```

---

### 10. Name Generation

**Formula**: `[Prefix] [City] [Suffix]`

```python
def generate_accommodation_name(location: str, accommodation_type: str) -> str:
    prefixes = ["The", "Grand", "Royal", "Paradise", "Ocean", 
                "Hill", "Palm", "Green", "Blue", "Golden"]
    suffixes = ["Resort", "Hotel", "Villa", "Retreat", "Lodge", 
                "Inn", "Guesthouse", "Hideaway"]
    
    if accommodation_type == "hostel":
        return f"{random.choice(['Backpacker', 'Traveler', 'Explorer'])} {location} Hostel"
    elif accommodation_type == "eco_lodge":
        return f"{location} {random.choice(['Eco', 'Nature', 'Green'])} Lodge"
    else:
        return f"{random.choice(prefixes)} {location} {random.choice(suffixes)}"
```

**Examples**:
```python
# Resort in Galle
"Paradise Galle Resort"

# Hostel in Kandy
"Backpacker Kandy Hostel"

# Villa in Ella
"Golden Ella Villa"

# Eco Lodge in Trincomalee
"Trincomalee Nature Lodge"
```

---

## Code Walkthrough

### Complete Generation Function

```python
def generate_mock_accommodations(count: int = 1000) -> List[Dict]:
    """Generate realistic mock accommodation data."""
    accommodations = []
    
    for i in range(count):
        # 1. Select location
        province = random.choice(list(PROVINCES.keys()))
        city = random.choice(PROVINCES[province])
        
        # 2. Select type (weighted)
        accom_type = random.choices(
            TYPES,
            weights=[25, 15, 20, 20, 10, 5, 5],
            k=1
        )[0]
        
        # 3. Generate price based on type
        if accom_type == "hostel":
            price_min = random.randint(500, 1500)
            price_max = price_min + random.randint(500, 1000)
        elif accom_type in ["resort", "villa", "boutique_hotel"]:
            price_min = random.randint(5000, 15000)
            price_max = price_min + random.randint(5000, 20000)
        else:
            price_min = random.randint(2000, 8000)
            price_max = price_min + random.randint(2000, 8000)
        
        # 4. Select amenities (3-8)
        num_amenities = random.randint(3, 8)
        selected_amenities = random.sample(AMENITIES, num_amenities)
        
        # Ensure essentials
        if "wifi" not in selected_amenities and random.random() > 0.2:
            selected_amenities.append("wifi")
        if "hot_water" not in selected_amenities and random.random() > 0.1:
            selected_amenities.append("hot_water")
        
        # 5. Select interests (2-5)
        num_interests = random.randint(2, 5)
        selected_interests = random.sample(INTERESTS, num_interests)
        
        # Context-aware interests
        if city in ["Galle", "Mirissa", "Hikkaduwa", "Negombo", "Trincomalee", "Arugam Bay", "Tangalle"]:
            if "coastal" not in selected_interests:
                selected_interests.append("coastal")
        
        if city in ["Nuwara Eliya", "Ella", "Kandy", "Badulla"]:
            if "hiking" not in selected_interests and random.random() > 0.5:
                selected_interests.append("hiking")
        
        # 6. Select travel styles (1-3)
        num_styles = random.randint(1, 3)
        selected_styles = random.sample(TRAVEL_STYLES, num_styles)
        
        # 7. Calculate group size based on type
        if accom_type in ["resort", "hotel"]:
            group_size = random.randint(2, 20)
        elif accom_type == "villa":
            group_size = random.randint(4, 12)
        elif accom_type == "hostel":
            group_size = random.randint(1, 8)
        else:
            group_size = random.randint(2, 6)
        
        # 8. Generate rating (triangular distribution)
        rating = round(random.triangular(2.5, 5.0, 4.2), 1)
        
        # 9. Generate prior bookings (log-normal distribution)
        prior_bookings = int(random.lognormvariate(3, 1.5))
        prior_bookings = min(prior_bookings, 500)
        
        # 10. Create accommodation object
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
```

---

## Statistical Distributions

### Expected Output (1000 records)

**Province Distribution** (approximately):
```
Eastern:          ~111 (11.1%)
Central:          ~111 (11.1%)
Southern:         ~111 (11.1%)
Western:          ~111 (11.1%)
North Central:    ~111 (11.1%)
Sabaragamuwa:     ~111 (11.1%)
North Western:    ~111 (11.1%)
Northern:         ~111 (11.1%)
Uva:              ~111 (11.1%)
```

**Type Distribution**:
```
hotel:            ~250 (25%)
resort:           ~200 (20%)
guesthouse:       ~200 (20%)
villa:            ~150 (15%)
hostel:           ~100 (10%)
boutique_hotel:   ~50  (5%)
eco_lodge:        ~50  (5%)
```

**Price Range** (minimum prices):
```
Min:      ~500 LKR
Max:      ~15,000 LKR
Average:  ~6,500 LKR
```

**Rating Distribution**:
```
Min:      2.5
Max:      5.0
Average:  ~3.9-4.0
```

**Availability**:
```
Available:    ~900 (90%)
Unavailable:  ~100 (10%)
```

---

## Examples

### Example 1: Luxury Resort

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Paradise Galle Resort",
  "provider_id": "f9e8d7c6-b5a4-3210-9876-543210fedcba",
  "type": ["resort"],
  "amenities": ["wifi", "pool", "spa", "beach_access", "restaurant", "bar", "gym", "hot_water"],
  "rating": 4.7,
  "location": "Galle",
  "price_range_min": 12500.0,
  "price_range_max": 28000.0,
  "province": "Southern",
  "interests": ["coastal", "luxury", "romantic", "diving", "relaxation"],
  "travel_style": ["luxury", "romantic", "relaxation"],
  "group_size": 15,
  "prior_bookings": 245,
  "availability": true
}
```

### Example 2: Budget Hostel

```json
{
  "id": "11223344-5566-7788-99aa-bbccddeeff00",
  "name": "Backpacker Kandy Hostel",
  "provider_id": "aabbccdd-eeff-0011-2233-445566778899",
  "type": ["hostel"],
  "amenities": ["wifi", "hot_water", "laundry"],
  "rating": 4.1,
  "location": "Kandy",
  "price_range_min": 850.0,
  "price_range_max": 1400.0,
  "province": "Central",
  "interests": ["cultural", "budget_friendly", "photography"],
  "travel_style": ["budget", "solo"],
  "group_size": 4,
  "prior_bookings": 78,
  "availability": true
}
```

### Example 3: Family Villa

```json
{
  "id": "99887766-5544-3322-1100-ffeeddccbbaa",
  "name": "Golden Ella Villa",
  "provider_id": "66554433-2211-0099-8877-665544332211",
  "type": ["villa"],
  "amenities": ["wifi", "pool", "parking", "garden", "air_conditioning", "bbq", "hot_water"],
  "rating": 4.5,
  "location": "Ella",
  "price_range_min": 8500.0,
  "price_range_max": 16200.0,
  "province": "Uva",
  "interests": ["adventure", "hiking", "family_friendly", "photography", "eco_friendly"],
  "travel_style": ["family", "adventure"],
  "group_size": 8,
  "prior_bookings": 142,
  "availability": true
}
```

---

## Usage

### Generate Data

```bash
cd /home/gihan/WBTH/apps/ml
./venv/bin/python data_generator.py
```

### Output

```
Generating mock accommodation data...
✓ Generated 1000 accommodations
✓ Saved to mock_accommodations.json

=== Data Statistics ===

Province distribution:
  Eastern: 123
  Central: 115
  ...

Type distribution:
  hotel: 260
  resort: 208
  ...
```

### Load in Python

```python
import json

# Load generated data
with open('mock_accommodations.json', 'r') as f:
    accommodations = json.load(f)

# Use in recommendation system
from recommender import AccommodationRecommender
recommender = AccommodationRecommender(accommodations)
```

---

## Key Takeaways

1. **Realistic Data**: Weighted distributions match real tourism patterns
2. **Context-Aware**: Location influences amenities and interests
3. **Type-Specific**: Different accommodation types have appropriate characteristics
4. **Statistical Validity**: Proper use of distributions (triangular, log-normal)
5. **Complete Coverage**: All fields required by recommendation algorithm
6. **Reproducible**: Set random seed for consistent results if needed

---

## Future Enhancements

1. **Seasonal Variations**: Add date-based availability patterns
2. **Pricing Dynamics**: Seasonal price adjustments
3. **Geo-Coordinates**: Add lat/lng for distance calculations
4. **Real Data Integration**: Replace mock with actual database queries
5. **User Preferences**: Generate mock user profiles for testing
6. **Booking History**: Generate realistic booking patterns over time

---

**Related Documentation**:
- [ML_progress.md](../apps/ml/ML_progress.md) - Overall implementation
- [data_generator.py](../apps/ml/data_generator.py) - Source code
- [recommender.py](../apps/ml/recommender.py) - How generated data is used
