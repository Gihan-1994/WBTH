# ML Recommendation Engine (WBTH)

This directory contains the machine learning core for the WBTH travel platform, featuring hybrid recommendation models for both accommodations and tour guides.

## 🚀 Quick Start

The easiest way to get the environment ready is to use the provided setup script, which handles virtual environment creation, dependency installation, and initial data generation.

```bash
cd apps/ml
bash setup.sh
```

### Manual Setup
If you prefer manual control:
```bash
python3 -m venv venv
source venv/bin/activate
python3 data/data_generator.py  # Generate mock data
```

---

## 🧠 Models Overview

The system implements two specialized hybrid recommendation engines designed for the Sri Lankan tourism context.

### 1. Accommodation Recommender
Located in `recommender.py`, this model uses a **Rule-First + Scored Ranking** approach.

*   **Hard Rule Filters**:
    *   **Availability**: Instant exclusion of unavailable bookings.
    *   **Budget**: Range intersection (LKR) to ensure affordability.
    *   **Group Size**: Verification of maximum guest capacity.
    *   **Location**: Optional "city-only" enforcement.
*   **Weighted Scoring Algorithm**:
    *   **Interests (20%)**: Jaccard similarity between user tags and property tags.
    *   **Travel Style (5%)**: Match against user style (Luxury, Budget, Adventure, etc.).
    *   **Price Alignment (10%)**: Penalty-based scoring for distance from user's "sweet spot" price.
    *   **Amenities (15%)**: Weighted matching of requested features (Wifi, Pool, etc.).
    *   **Location Depth (15%)**: Tiered scoring (Exact City > Province > General Region).
    *   **Quality Metrics (25%)**: Combination of User Rating (20%) and Popularity/Prior Bookings (5%).

### 2. Guide Recommender
Located in `GuidesRecommendationModel/guide_recommender.py`, this model uses a **Point-Additive Scoring** system tailored for service providers.

*   **Primary Constraints**:
    *   **Language**: Strict requirement for at least one overlapping language.
    *   **Price**: Strict daily rate budget enforcement.
*   **Scoring Points**:
    *   **Expertise Match**: High bonus for specific overlap (e.g., Wildlife, Surfing).
    *   **Location Tiers**: Points for proximity (City vs Province).
    *   **Platform Priority**: Significant point boost for guides verified in the PostgreSQL system.
    *   **Social Proof**: Cumulative points based on normalized ratings and popularity.

---

## 🧪 Testing Guide

We maintain high confidence in our recommendation quality through multiple layers of testing.

### Automated Unit Tests
First, ensure your virtual environment is activated:
```bash
source venv/bin/activate
```

Run the full suite using `pytest`. This verifies hard filters, edge cases, and scoring math.
```bash
# From apps/ml
python3 -m pytest tests/test_recommender.py -v
python3 -m pytest tests/test_guide_recommender.py -v
```

### Scripted Scenario Tests
Specialized scripts focused on specific logic debugging:

*   **Location Filter Test**: Validates the city vs. province boundary logic.
    ```bash
    python3 tests/test_location_filter.py
    ```
*   **Custom Data Test**: An interactive way to test specific queries against the mock catalog.
    ```bash
    python3 tests/test_custom_data.py
    ```

### Evaluation Suite
To see high-level performance metrics (Precision@K, NDCG, etc.) across various user personas (e.g., "Luxury Beach Traveler" vs "Budget Backpacker"):
```bash
python3 evaluation.py
```

---

## 📊 Summary Statistics
Typical performance metrics with a catalog of 1000 items:
*   **Precision@5**: ~0.84
*   **NDCG@10**: ~0.68
*   **Mean Average Precision**: ~0.03 (catalog-wide)

