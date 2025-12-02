# ML Recommendation System Mechanism

## Overview

This document provides an in-depth explanation of the **Hybrid Accommodation Recommendation System**, which combines rule-based filtering with weighted scoring to generate personalized accommodation recommendations.

---

## Table of Contents

1. [Algorithm Architecture](#algorithm-architecture)
2. [Recommendation Flow](#recommendation-flow)
3. [Hard Rule Filters](#hard-rule-filters)
4. [Scoring Components](#scoring-components)
5. [Weight Configuration](#weight-configuration)
6. [Ranking & Tie-Breaking](#ranking--tie-breaking)
7. [Reason Generation](#reason-generation)
8. [Complete Examples](#complete-examples)
9. [Performance Characteristics](#performance-characteristics)

---

## Algorithm Architecture

### Hybrid Approach

The system uses a **two-stage hybrid algorithm**:

```
User Query
    |
    v
┌─────────────────────────┐
│ Stage 1: Hard Filters   │  ← Fast elimination
│ (Rule-based)            │     (Binary pass/fail)
└──────────┬──────────────┘
           |
           v
    Candidates (filtered)
           |
           v
┌─────────────────────────┐
│ Stage 2: Scoring        │  ← Precise ranking
│ (Weighted ML)           │     (Score 0.0-1.0)
└──────────┬──────────────┘
           |
           v
    Top-k Recommendations
```

**Why Hybrid?**
- **Efficiency**: Hard filters eliminate 80-90% of candidates quickly
- **Precision**: Scoring ranks remaining candidates accurately
- **Explainability**: Combination provides clear reasons

---

## Recommendation Flow

### Complete Pipeline

```python
def recommend(user_query):
    # 1. Apply hard rule filters
    candidates = apply_hard_filters(all_accommodations, user_query)
    
    # 2. Score each candidate
    scored_candidates = []
    for accommodation in candidates:
        score = calculate_weighted_score(accommodation, user_query)
        scored_candidates.append((accommodation, score))
    
    # 3. Rank by score
    ranked = sort_by_score_and_tiebreakers(scored_candidates)
    
    # 4. Generate reasons
    top_k = ranked[:k]
    recommendations = add_reasons(top_k)
    
    return recommendations
```

---

## Hard Rule Filters

### Overview

**Purpose**: Quickly eliminate accommodations that don't meet basic requirements.

**Characteristics**:
- **Binary**: Pass or fail (no partial credit)
- **Fast**: O(1) per accommodation
- **Mandatory**: All filters must pass

### Filter 1: Availability

**Rule**: Accommodation must be available.

```python
def availability_filter(accommodation, query):
    """Filter out unavailable accommodations."""
    if not accommodation.get("availability", True):
        return False  # REJECT
    return True  # PASS
```

**Example**:
```python
# User queries for any accommodation
accommodation = {"availability": False, ...}
# → REJECTED (not available)

accommodation = {"availability": True, ...}
# → PASS
```

---

### Filter 2: Budget Window

**Rule**: Accommodation price range must intersect with user budget.

**Logic**: Price ranges overlap if:
```
accommodation_min ≤ user_max AND accommodation_max ≥ user_min
```

```python
def budget_filter(accommodation, query):
    """Filter by budget intersection."""
    user_min = query["budget_min"]
    user_max = query["budget_max"]
    
    acc_min = accommodation.get("price_range_min", 0)
    acc_max = accommodation.get("price_range_max", float('inf'))
    
    # Check intersection
    if acc_min <= user_max and acc_max >= user_min:
        return True  # PASS
    return False  # REJECT
```

**Examples**:

```python
# Example 1: Perfect overlap
user_budget = (5000, 10000)
accommodation = {"price_range_min": 5000, "price_range_max": 10000}
# 5000 ≤ 10000 AND 10000 ≥ 5000 → PASS ✓

# Example 2: Partial overlap
user_budget = (5000, 10000)
accommodation = {"price_range_min": 8000, "price_range_max": 15000}
# 8000 ≤ 10000 AND 15000 ≥ 5000 → PASS ✓

# Example 3: No overlap (too expensive)
user_budget = (5000, 10000)
accommodation = {"price_range_min": 12000, "price_range_max": 20000}
# 12000 > 10000 → REJECT ✗

# Example 4: No overlap (too cheap)
user_budget = (5000, 10000)
accommodation = {"price_range_min": 1000, "price_range_max": 3000}
# 3000 < 5000 → REJECT ✗
```

---

### Filter 3: Required Amenities

**Rule**: Accommodation must have ALL required amenities.

**Logic**: Set theory - required amenities must be subset of accommodation amenities.

```python
def amenities_filter(accommodation, query):
    """Filter by required amenities (all must be present)."""
    required = set(query["required_amenities"])
    available = set(accommodation.get("amenities", []))
    
    # Check if all required amenities are available
    if required.issubset(available):
        return True  # PASS
    return False  # REJECT
```

**Examples**:

```python
# Example 1: All required amenities present
required = ["wifi", "pool"]
accommodation = {"amenities": ["wifi", "pool", "spa", "gym"]}
# {"wifi", "pool"} ⊆ {"wifi", "pool", "spa", "gym"} → PASS ✓

# Example 2: One amenity missing
required = ["wifi", "pool", "gym"]
accommodation = {"amenities": ["wifi", "pool", "spa"]}
# {"wifi", "pool", "gym"} ⊄ {"wifi", "pool", "spa"} → REJECT ✗

# Example 3: No requirements
required = []
accommodation = {"amenities": ["wifi"]}
# {} ⊆ {"wifi"} → PASS ✓ (empty set is subset of any set)
```

---

### Filter 4: Location

**Rule**: If `city_only=True`, accommodation must be in specified city.

```python
def location_filter(accommodation, query):
    """Filter by city if city_only is True."""
    if query.get("city_only") and query.get("location_city"):
        required_city = query["location_city"]
        actual_city = accommodation.get("location")
        
        if actual_city == required_city:
            return True  # PASS
        return False  # REJECT
    
    # If city_only is False, pass all (scoring will handle location preference)
    return True  # PASS
```

**Examples**:

```python
# Example 1: City-only search, match
query = {"location_city": "Galle", "city_only": True}
accommodation = {"location": "Galle"}
# → PASS ✓

# Example 2: City-only search, no match
query = {"location_city": "Galle", "city_only": True}
accommodation = {"location": "Colombo"}
# → REJECT ✗

# Example 3: Province search (city_only=False)
query = {"location_province": "Southern", "city_only": False}
accommodation = {"location": "Colombo", "province": "Western"}
# → PASS ✓ (will be scored lower for location, but not filtered out)
```

---

### Filter 5: Group Size

**Rule**: Accommodation capacity must be ≥ requested group size.

```python
def group_size_filter(accommodation, query):
    """Filter by group size capacity."""
    requested_size = query["group_size"]
    capacity = accommodation.get("group_size", 0)
    
    if capacity >= requested_size:
        return True  # PASS
    return False  # REJECT
```

**Examples**:

```python
# Example 1: Sufficient capacity
query = {"group_size": 4}
accommodation = {"group_size": 6}
# 6 ≥ 4 → PASS ✓

# Example 2: Exact capacity
query = {"group_size": 4}
accommodation = {"group_size": 4}
# 4 ≥ 4 → PASS ✓

# Example 3: Insufficient capacity
query = {"group_size": 4}
accommodation = {"group_size": 2}
# 2 < 4 → REJECT ✗
```

---

## Scoring Components

### Overview

After filtering, each candidate gets a **weighted score** from 0.0 to 1.0.

**Formula**:
```
Total_Score = w₁·S_interests + w₂·S_style + w₃·S_price + w₄·S_amenities +
              w₅·S_location + w₆·S_group + w₇·S_rating + w₈·S_popularity
```

**Where**: Each S_x is normalized to [0, 1]

---

### Component 1: Interests (S_interests)

**Metric**: **Jaccard Similarity** on interest tags

**Formula**:
```
              |A ∩ B|
J(A, B) = ─────────────
              |A ∪ B|
```

**Code**:
```python
def calculate_interests_score(user_interests, accommodation_interests):
    """Calculate Jaccard similarity for interests."""
    set_user = set(user_interests)
    set_acc = set(accommodation_interests)
    
    if not set_user or not set_acc:
        return 0.0
    
    intersection = len(set_user & set_acc)
    union = len(set_user | set_acc)
    
    return intersection / union if union > 0 else 0.0
```

**Examples**:

```python
# Example 1: Perfect match
user = ["coastal", "luxury", "romantic"]
accommodation = ["coastal", "luxury", "romantic"]
# |{coastal, luxury, romantic}| / |{coastal, luxury, romantic}| = 3/3 = 1.0

# Example 2: Partial overlap
user = ["coastal", "luxury", "romantic"]
accommodation = ["coastal", "adventure", "diving"]
# |{coastal}| / |{coastal, luxury, romantic, adventure, diving}| = 1/5 = 0.2

# Example 3: No overlap
user = ["cultural", "historical"]
accommodation = ["coastal", "adventure"]
# |{}| / |{cultural, historical, coastal, adventure}| = 0/4 = 0.0
```

---

### Component 2: Travel Style (S_style)

**Metric**: **Binary Match**

```python
def calculate_style_score(user_style, accommodation_styles):
    """Binary match: 1 if style is in accommodation styles, else 0."""
    if user_style in accommodation_styles:
        return 1.0
    return 0.0
```

**Examples**:

```python
# Example 1: Match
user_style = "luxury"
accommodation = {"travel_style": ["luxury", "romantic"]}
# "luxury" in ["luxury", "romantic"] → 1.0

# Example 2: No match
user_style = "budget"
accommodation = {"travel_style": ["luxury", "romantic"]}
# "budget" not in ["luxury", "romantic"] → 0.0
```

---

### Component 3: Price Alignment (S_price)

**Metric**: **Overlap-based with distance penalty**

```python
def calculate_price_score(user_min, user_max, acc_min, acc_max):
    """Calculate price alignment score."""
    # Calculate overlap
    overlap_min = max(user_min, acc_min)
    overlap_max = min(user_max, acc_max)
    
    if overlap_max >= overlap_min:
        # Ranges overlap
        overlap = overlap_max - overlap_min
        user_range = user_max - user_min
        return min(1.0, overlap / user_range) if user_range > 0 else 1.0
    else:
        # No overlap - apply distance penalty
        if acc_max < user_min:
            distance = user_min - acc_max  # Too cheap
        else:
            distance = acc_min - user_max  # Too expensive
        
        penalty_factor = 0.001
        return max(0.0, 1.0 - distance * penalty_factor)
```

**Examples**:

```python
# Example 1: Perfect overlap
user = (5000, 10000)
accommodation = (5000, 10000)
# overlap = 5000, user_range = 5000 → 5000/5000 = 1.0

# Example 2: Partial overlap (50%)
user = (5000, 10000)
accommodation = (7500, 12500)
# overlap = (7500-10000) = 2500, user_range = 5000 → 2500/5000 = 0.5

# Example 3: No overlap, slightly expensive
user = (5000, 10000)
accommodation = (11000, 15000)
# distance = 11000 - 10000 = 1000
# score = 1.0 - (1000 * 0.001) = 0.0

# Example 4: No overlap, moderately expensive
user = (5000, 10000)
accommodation = (10500, 15000)
# distance = 10500 - 10000 = 500
# score = 1.0 - (500 * 0.001) = 0.5
```

---

### Component 4: Amenities (S_amenities)

**Metric**: **Jaccard Similarity** (like interests)

```python
def calculate_amenities_score(desired_amenities, accommodation_amenities):
    """Calculate Jaccard similarity for amenities."""
    # Desired includes required + commonly desired (wifi, pool, parking)
    set_desired = set(desired_amenities)
    set_acc = set(accommodation_amenities)
    
    if not set_desired or not set_acc:
        return 0.0
    
    intersection = len(set_desired & set_acc)
    union = len(set_desired | set_acc)
    
    return intersection / union if union > 0 else 0.0
```

---

### Component 5: Location (S_location)

**Metric**: **Tiered Scoring** based on geographic proximity

```python
def calculate_location_score(acc_city, acc_province, user_city, user_province):
    """Calculate tiered location score."""
    # No preference
    if not user_city and not user_province:
        return 0.5
    
    # City match (highest)
    if user_city and acc_city == user_city:
        return 1.0
    
    # Province match (medium)
    if user_province and acc_province == user_province:
        return 0.6
    
    # Outside province (low)
    return 0.15
```

**Tier Breakdown**:
```
┌─────────────────┬───────┬─────────────────────┐
│ Match Level     │ Score │ Meaning             │
├─────────────────┼───────┼─────────────────────┤
│ Same City       │ 1.00  │ Exact location      │
│ Same Province   │ 0.60  │ Nearby              │
│ Other Province  │ 0.15  │ Far away            │
│ No Preference   │ 0.50  │ Neutral             │
└─────────────────┴───────┴─────────────────────┘
```

**Examples**:

```python
# Example 1: City match
user = {"city": "Galle", "province": "Southern"}
accommodation = {"location": "Galle", "province": "Southern"}
# → 1.0

# Example 2: Province match only
user = {"city": "Galle", "province": "Southern"}
accommodation = {"location": "Matara", "province": "Southern"}
# → 0.6

# Example 3: Different province
user = {"city": "Galle", "province": "Southern"}
accommodation = {"location": "Colombo", "province": "Western"}
# → 0.15

# Example 4: No preference
user = {"city": None, "province": None}
accommodation = {"location": "Galle", "province": "Southern"}
# → 0.5
```

---

### Component 6: Group Size (S_group)

**Metric**: **Binary Fit**

```python
def calculate_group_score(requested_size, capacity):
    """Binary: 1 if fits, else 0."""
    if capacity >= requested_size:
        return 1.0
    return 0.0
```

**Note**: This is redundant with Filter 5 (all candidates already pass), but included for scoring transparency.

---

### Component 7: Rating (S_rating)

**Metric**: **Normalized Rating**

```python
def calculate_rating_score(rating):
    """Normalize rating to [0, 1]."""
    if rating is None:
        return 0.5  # Neutral for missing ratings
    
    return min(1.0, rating / 5.0)
```

**Examples**:

```python
rating = 5.0 → 5.0/5.0 = 1.0
rating = 4.5 → 4.5/5.0 = 0.9
rating = 4.0 → 4.0/5.0 = 0.8
rating = 3.5 → 3.5/5.0 = 0.7
rating = 2.5 → 2.5/5.0 = 0.5
rating = None → 0.5 (default)
```

---

### Component 8: Popularity (S_popularity)

**Metric**: **Log-Scaled Prior Bookings**

**Why Log Scale?**
- Accommodations with 100 vs 200 bookings aren't twice as good
- Diminishing returns: 500 → 600 bookings matters less than 10 → 20

```python
import math

def calculate_popularity_score(prior_bookings, all_candidates):
    """Log-scaled popularity relative to max in candidates."""
    max_bookings = max(acc["prior_bookings"] for acc in all_candidates)
    
    if max_bookings == 0:
        return 0.0
    
    score = math.log(1 + prior_bookings) / math.log(1 + max_bookings)
    return score
```

**Examples**:

```python
# Candidate pool: max_bookings = 500

# Example 1: Most popular
prior_bookings = 500
# log(1+500) / log(1+500) = log(501)/log(501) = 1.0

# Example 2: Moderately popular
prior_bookings = 100
# log(1+100) / log(1+500) = log(101)/log(501) ≈ 0.74

# Example 3: New listing
prior_bookings = 10
# log(1+10) / log(1+500) = log(11)/log(501) ≈ 0.39

# Example 4: No bookings yet
prior_bookings = 0
# log(1+0) / log(1+500) = log(1)/log(501) = 0/6.21 = 0.0
```

---

## Weight Configuration

### Default Weights

As per architecture specification (section 4.1):

```python
DEFAULT_WEIGHTS = [
    0.20,  # w1: S_interests
    0.05,  # w2: S_style
    0.10,  # w3: S_price
    0.15,  # w4: S_amenities
    0.15,  # w5: S_location
    0.10,  # w6: S_group
    0.20,  # w7: S_rating
    0.05   # w8: S_popularity
]

# Total = 1.00
```

### Weight Rationale

```
┌──────────────┬────────┬────────────────────────────────┐
│ Component    │ Weight │ Reasoning                      │
├──────────────┼────────┼────────────────────────────────┤
│ Rating       │ 0.20   │ Quality indicator (highest)    │
│ Interests    │ 0.20   │ Match user preferences         │
│ Amenities    │ 0.15   │ Important for comfort          │
│ Location     │ 0.15   │ Geographic preference          │
│ Price        │ 0.10   │ Budget alignment               │
│ Group Size   │ 0.10   │ Capacity fit                   │
│ Style        │ 0.05   │ Nice-to-have                   │
│ Popularity   │ 0.05   │ Social proof (lowest)          │
└──────────────┴────────┴────────────────────────────────┘
```

### Custom Weights

```python
# Example: Price-conscious user
budget_weights = [0.15, 0.05, 0.25, 0.10, 0.10, 0.10, 0.20, 0.05]
#                 ↑                ↑↑
#               interests       price (increased)

# Example: Location-focused user
location_weights = [0.15, 0.05, 0.05, 0.10, 0.30, 0.10, 0.20, 0.05]
#                                              ↑↑
#                                          location (increased)

# Create recommender with custom weights
recommender = AccommodationRecommender(accommodations, weights=budget_weights)
```

---

## Ranking & Tie-Breaking

### Primary: Score

Accommodations sorted by total score (descending).

### Tie-Breakers

When scores are equal:

```python
def rank_accommodations(scored_candidates):
    """Rank by score, then tie-breakers."""
    ranked = sorted(
        scored_candidates,
        key=lambda x: (
            x["score"],                              # 1. Total score (primary)
            x["accommodation"]["rating"] or 0,       # 2. Rating (if tied)
            x["accommodation"]["prior_bookings"]     # 3. Popularity (if still tied)
        ),
        reverse=True
    )
    return ranked
```

**Example**:

```
┌────┬─────────────────┬───────┬────────┬──────────┬────────┐
│ #  │ Accommodation   │ Score │ Rating │ Bookings │ Result │
├────┼─────────────────┼───────┼────────┼──────────┼────────┤
│ 1  │ Beach Resort A  │ 0.85  │ 4.8    │ 200      │ 1st    │
│ 2  │ Beach Resort B  │ 0.85  │ 4.5    │ 250      │ 2nd ←  │
│ 3  │ Beach Resort C  │ 0.85  │ 4.5    │ 180      │ 3rd ←  │
│ 4  │ City Hotel      │ 0.82  │ 4.9    │ 300      │ 4th    │
└────┴─────────────────┴───────┴────────┴──────────┴────────┘
         Same score ──────────┘    ↑        ↑
                         Tie-breaker 1   Tie-breaker 2
```

Resorts B and C have same score (0.85) and rating (4.5), so bookings decide: B (250) > C (180).

---

## Reason Generation

### Purpose

Explain **why** an accommodation was recommended.

### Strategy

Select **top 3 contributing factors** based on:
1. Component value
2. Component weight
3. Contribution = value × weight

```python
def generate_reasons(score_components, accommodation, weights):
    """Generate top 3 reasons for recommendation."""
    # Calculate contributions
    contributions = [
        (component_name, score * weight)
        for (component_name, score), weight in zip(score_components.items(), weights)
    ]
    
    # Sort by contribution (highest first)
    contributions.sort(key=lambda x: x[1], reverse=True)
    
    # Generate human-readable reasons for top 3
    reasons = []
    for component, _ in contributions[:3]:
        reason = create_reason_text(component, accommodation)
        if reason:
            reasons.append(reason)
    
    return reasons
```

### Reason Templates

```python
def create_reason_text(component, accommodation):
    """Convert component to human-readable reason."""
    if component == "location":
        if score >= 0.9:
            return f"Within {accommodation['location']}"
        elif score >= 0.5:
            return f"Within {accommodation['province']}"
    
    elif component == "interests":
        if score > 0.3:
            interests = accommodation["interests"][:2]
            return f"Matches {' & '.join(interests)}"
    
    elif component == "amenities":
        if score > 0.5:
            amenities = accommodation["amenities"][:3]
            return f"Has {', '.join(amenities)}"
    
    elif component == "rating":
        rating = accommodation["rating"]
        if rating >= 4.5:
            return f"Excellent rating ({rating:.1f}/5.0)"
        elif rating >= 4.0:
            return f"High rating ({rating:.1f}/5.0)"
    
    elif component == "style":
        if score > 0:
            style = accommodation["travel_style"][0]
            return f"{style.replace('_', ' ').title()} style"
    
    elif component == "popularity":
        if score > 0.7:
            return "Popular choice"
    
    elif component == "price":
        if score > 0.8:
            return "Within budget"
    
    return None
```

**Example**:

```python
# Accommodation with high rating and good location
score_components = {
    "rating": 0.96,      # 4.8/5.0
    "location": 1.0,     # Same city
    "interests": 0.67,   # 2 of 3 match
    "amenities": 0.45,
    "price": 0.80,
    ...
}
weights = [0.20, 0.05, 0.10, 0.15, 0.15, 0.10, 0.20, 0.05]

# Contributions:
# rating: 0.96 × 0.20 = 0.192 ← Top 1
# location: 1.0 × 0.15 = 0.150 ← Top 2
# interests: 0.67 × 0.20 = 0.134 ← Top 3

# Generated reasons:
reasons = [
    "Excellent rating (4.8/5.0)",
    "Within Galle",
    "Matches coastal & luxury"
]
```

---

## Complete Examples

### Example 1: Luxury Beach Vacation

**User Query**:
```python
query = {
    "budget_min": 10000,
    "budget_max": 25000,
    "required_amenities": ["wifi", "pool"],
    "interests": ["coastal", "luxury", "romantic"],
    "travel_style": "luxury",
    "group_size": 2,
    "location_city": "Galle",
    "location_province": "Southern",
    "city_only": False,
    "top_k": 5
}
```

**Accommodation**:
```python
accommodation = {
    "id": "resort-001",
    "name": "Paradise Galle Resort",
    "location": "Galle",
    "province": "Southern",
    "price_range_min": 15000,
    "price_range_max": 28000,
    "amenities": ["wifi", "pool", "spa", "beach_access", "restaurant", "bar"],
    "interests": ["coastal", "luxury", "romantic", "diving"],
    "travel_style": ["luxury", "romantic", "relaxation"],
    "group_size": 15,
    "rating": 4.7,
    "prior_bookings": 245,
    "availability": True
}
```

**Step-by-Step Scoring**:

```python
# Hard Filters (all PASS)
✓ Availability: True
✓ Budget: 15000 ≤ 25000 AND 28000 ≥ 10000
✓ Amenities: {wifi, pool} ⊆ {wifi, pool, spa, ...}
✓ Location: city_only=False (pass all)
✓ Group Size: 15 ≥ 2

# Scoring
S_interests = |{coastal, luxury, romantic}| / |{coastal, luxury, romantic, diving}|
            = 3/4 = 0.75

S_style = "luxury" in ["luxury", "romantic", "relaxation"]
        = 1.0

S_price = overlap(10000-25000, 15000-28000) = (25000-15000) / (25000-10000)
        = 10000/15000 = 0.67

S_amenities = |{wifi, pool, parking}| / |{wifi, pool, parking, spa, beach_access, ...}|
            = 2/7 ≈ 0.29

S_location = acc_city == user_city
           = "Galle" == "Galle" = 1.0

S_group = 15 ≥ 2 = 1.0

S_rating = 4.7/5.0 = 0.94

S_popularity = log(1+245) / log(1+max_bookings)
             ≈ 0.85 (assuming max_bookings=500)

# Weighted Total
Total = 0.20×0.75 + 0.05×1.0 + 0.10×0.67 + 0.15×0.29 + 
        0.15×1.0 + 0.10×1.0 + 0.20×0.94 + 0.05×0.85
      = 0.150 + 0.050 + 0.067 + 0.044 + 0.150 + 0.100 + 0.188 + 0.043
      = 0.792

# Reasons (top 3 by contribution)
# 1. rating (0.188): "Excellent rating (4.7/5.0)"
# 2. location (0.150): "Within Galle"
# 3. interests (0.150): "Matches coastal & luxury & romantic"
```

**Final Recommendation**:
```json
{
  "id": "resort-001",
  "name": "Paradise Galle Resort",
  "location": "Galle, Southern",
  "price_range_min": 15000,
  "price_range_max": 28000,
  "rating": 4.7,
  "score": 0.792,
  "reasons": [
    "Excellent rating (4.7/5.0)",
    "Within Galle",
    "Matches coastal & luxury & romantic"
  ]
}
```

---

### Example 2: Budget Backpacker

**User Query**:
```python
query = {
    "budget_min": 500,
    "budget_max": 2000,
    "required_amenities": ["wifi"],
    "interests": ["cultural", "budget_friendly"],
    "travel_style": "budget",
    "group_size": 1,
    "location_province": "Central",
    "city_only": False,
    "top_k": 5
}
```

**Accommodation**:
```python
accommodation = {
    "id": "hostel-002",
    "name": "Backpacker Kandy Hostel",
    "location": "Kandy",
    "province": "Central",
    "price_range_min": 800,
    "price_range_max": 1500,
    "amenities": ["wifi", "hot_water", "laundry"],
    "interests": ["cultural", "budget_friendly", "photography"],
    "travel_style": ["budget", "solo"],
    "group_size": 4,
    "rating": 4.2,
    "prior_bookings": 68,
    "availability": True
}
```

**Scoring**:

```python
S_interests = 2/3 ≈ 0.67    # {cultural, budget_friendly} ∩ {...}
S_style = 1.0               # "budget" match
S_price = 1.0               # Perfect overlap
S_amenities = 0.25          # 1/4 match (wifi + pool, parking)
S_location = 0.6            # Province match (not city)
S_group = 1.0               # 4 ≥ 1
S_rating = 0.84             # 4.2/5.0
S_popularity = 0.68         # log-scaled

Total = 0.20×0.67 + 0.05×1.0 + 0.10×1.0 + 0.15×0.25 +
        0.15×0.6 + 0.10×1.0 + 0.20×0.84 + 0.05×0.68
      ≈ 0.684

Reasons:
  1. "Within budget"
  2. "High rating (4.2/5.0)"
  3. "Matches cultural & budget_friendly"
```

---

## Performance Characteristics

### Time Complexity

```
┌────────────────────┬─────────────┬──────────────────┐
│ Operation          │ Complexity  │ Notes            │
├────────────────────┼─────────────┼──────────────────┤
│ Hard Filters       │ O(n)        │ n = total items  │
│ Scoring            │ O(m)        │ m = candidates   │
│ Sorting (top-k)    │ O(m log k)  │ k = result size  │
│ Reason Generation  │ O(k)        │ k items only     │
├────────────────────┼─────────────┼──────────────────┤
│ Total              │ O(n + m log k) │ m typically << n │
└────────────────────┴─────────────┴──────────────────┘
```

**Typical Case** (1000 accommodations, top-10):
- Filters eliminate 80%: n=1000 → m=200
- Sorting: 200 log 10 ≈ 460 operations
- **Total runtime**: <100ms

### Space Complexity

```
O(m) for storing candidates + scored results
```

Typically m ≈ 0.1-0.3 × n (filters eliminate 70-90%)

---

## Key Takeaways

1. **Hybrid Approach**: Combines efficiency (filters) with precision (scoring)
2. **Explainable**: Reasons show why each recommendation was made
3. **Tunable**: Weights can be adjusted per user segment
4. **Scalable**: Linear time complexity, suitable for 10k+ items
5. **Realistic**: Based on proven IR (Information Retrieval) techniques

---

## Future Enhancements

1. **Collaborative Filtering**: Use user-user similarity
2. **Learning to Rank**: Train weights from booking data
3. **Contextual Bandits**: Adaptive weights per user
4. **Semantic Search**: Use embeddings for interests/amenities
5. **Geographic Distance**: Use Haversine for precise location scoring
6. **Temporal Patterns**: Seasonality and trending accommodations

---

**Related Documentation**:
- [ML_data_generation.md](ML_data_generation.md) - How mock data is created
- [ML_progress.md](../apps/ml/ML_progress.md) - Implementation overview
- [recommender.py](../apps/ml/recommender.py) - Source code
- [evaluation.py](../apps/ml/evaluation.py) - How system is evaluated
