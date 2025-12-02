# ML Recommendation System - Implementation Progress

## Overview
Implemented a hybrid accommodation recommendation system following architecture specification section 4.1. The system uses rule-based filtering followed by weighted scoring to rank and recommend accommodations.

## Implementation Status: ✅ COMPLETE (Phase 1)

### Components Implemented

#### 1. Schema Updates
- ✅ Added `travel_style` field to Prisma Accommodation model
- ✅ Migration applied successfully: `20251202194702_add_travel_style_to_accommodation`
- **Field type**: `String[]` (array of travel styles)
- **Purpose**: Supports travel style matching in recommendation scoring

#### 2. Mock Data Generator (`data_generator.py`)
- ✅ Generates 1000 realistic accommodation records
- ✅ Sri Lankan provinces and cities (Western, Southern, Central, etc.)
- ✅ Accommodation types: hotel, villa, guesthouse, resort, hostel, boutique_hotel, eco_lodge
- ✅ Realistic price distributions based on type
- ✅ 16 amenities (wifi, pool, beach_access, spa, etc.)
- ✅ 15 interest tags (coastal, adventure, cultural, wildlife, etc.)
- ✅ 10 travel styles (luxury, budget, family, solo, adventure, etc.)
- ✅ Statistical distribution matching real-world tourism patterns

**Data Statistics** (example run):
- Province distribution weighted toward popular tourist areas
- Price range: 500 - 35,000 LKR
- Average rating: ~4.2/5.0
- 90% availability rate

#### 3. Recommendation Engine (`recommender.py`)

**Hard Rule Filters:**
1. ✅ Availability check
2. ✅ Budget window (price range intersection)
3. ✅ Required amenities (set inclusion)
4. ✅ Location filter (city/province/all - configurable)
5. ✅ Group size capacity

**Scoring Components** (weights as per spec):
- ✅ `S_interests` (w=0.20): Jaccard similarity on interest tags
- ✅ `S_style` (w=0.05): Binary travel style match
- ✅ `S_price` (w=0.10): Price alignment with distance penalty
- ✅ `S_amenities` (w=0.15): Jaccard similarity on amenities
- ✅ `S_location` (w=0.15): Tiered scoring (city=1.0, province=0.6, outside=0.15, no pref=0.5)
- ✅ `S_group` (w=0.10): Binary capacity fit
- ✅ `S_rating` (w=0.20): Normalized rating/5
- ✅ `S_popularity` (w=0.05): Log-scaled prior bookings

**Features:**
- ✅ Top-k ranking with tie-breakers (rating → prior_bookings)
- ✅ Reason generation (top 3 factors explaining each recommendation)
- ✅ Filters applied metadata for transparency
- ✅ Clean API designed for future integration

**Code Quality:**
- ✅ Well-documented with docstrings
- ✅ Type hints for function parameters
- ✅ Separation of concerns (filtering, scoring, ranking)
- ✅ Performance optimized (O(n) filtering, O(n log k) ranking)

#### 4. Evaluation Module (`evaluation.py`)

**Metrics Implemented:**
- ✅ Precision@k: Relevance of top-k recommendations
- ✅ Recall@k: Coverage of relevant items in top-k
- ✅ NDCG@k: Normalized Discounted Cumulative Gain
- ✅ Average Precision (AP): Mean precision across all relevant items
- ✅ Coverage: % of catalog recommended across queries

**Test Scenarios** (5 curated queries):
1. Luxury Beach (Galle) - coastal, luxury, romantic
2. Budget Backpacker (Kandy) - cultural, budget-friendly
3. Family Adventure (Ella) - family-friendly, adventure, hiking
4. Wildlife Safari (Eastern) - wildlife, eco-friendly
5. Romantic Getaway (Mirissa) - coastal, romantic, relaxation

**Relevance Determination:**
- Interest/tag overlap (0-0.5 points)
- Province match (0-0.3 points)
- Rating bonus (0-0.2 points)
- Threshold: relevance > 0.4 considered "relevant"

#### 5. Unit Tests (`test_recommender.py`)

**Test Coverage:**
- ✅ Hard filters (availability, budget, amenities, group size, location)
- ✅ Scoring functions (Jaccard, price alignment, location tiers)
- ✅ Full pipeline (luxury beach, budget backpacker, family adventure scenarios)
- ✅ Reason generation
- ✅ Edge cases (empty data, invalid weights, negative budgets)

**Total Tests**: 20+ test cases with pytest

## Dependencies

Required Python packages (listed in `requirements.txt`):
```
Flask==2.3.3
scikit-learn==1.3.2
pandas==2.1.3
numpy==1.26.2
pytest==7.4.3
```

**Installation Status**: ⚠️ **NOT INSTALLED**
- System does not have `pip` installed
- **Action needed**: Install dependencies via system package manager

**Installation commands** (choose one):
```bash
# Option 1: Install pip first
sudo apt install python3-pip
cd /home/gihan/WBTH/apps/ml
python3 -m pip install -r requirements.txt

# Option 2: Install via apt (recommended for system Python)
sudo apt install python3-pandas python3-numpy python3-sklearn python3-flask python3-pytest
```

## Usage Instructions

### 1. Generate Mock Data
```bash
cd /home/gihan/WBTH/apps/ml
python3 data_generator.py
```
**Output**: `mock_accommodations.json` (1000 records)

### 2. Run Recommendation Engine
```bash
python3 recommender.py
```
**Output**: 3 test scenarios with top-5 recommendations each, including scores and reasons

### 3. Run Evaluation
```bash
python3 evaluation.py
```
**Output**: Metrics for 5 test scenarios plus summary statistics

### 4. Run Unit Tests
```bash
python3 -m pytest test_recommender.py -v
```
**Output**: Test results for all 20+ test cases

## Expected Evaluation Results

Based on the algorithm design, we expect:
- **Precision@5**: 0.6-0.8 (most top recommendations should be relevant)
- **Precision@10**: 0.5-0.7 (slight drop with more recommendations)
- **Recall@5**: 0.3-0.5 (captures some relevant items)
- **Recall@10**: 0.5-0.7 (better coverage)
- **NDCG@5**: 0.6-0.8 (good ranking quality)
- **NDCG@10**: 0.6-0.8 (consistent ranking)
- **Coverage@10**: 15-30% (diverse recommendations across catalog)

## Algorithm Performance Characteristics

- **Time Complexity**: O(n) for filtering + O(n) for scoring + O(n log k) for top-k selection
- **Space Complexity**: O(n) for candidates
- **Expected Runtime**: <100ms for 1000 accommodations on modern hardware
- **Scalability**: Linear scaling; consider caching for larger datasets (10k+ items)

## Integration Plan for Next.js/Prisma

### Current State (Phase 1)
- ✅ Standalone Python application
- ✅ JSON file-based data (mock_accommodations.json)
- ✅ Hardcoded user inputs in test scenarios

### Future Integration (Phase 2+)

**Backend API Endpoint** (Flask):
```python
@app.route('/recommendations/accommodations', methods=['POST'])
def recommend_accommodations():
    # Parse request body
    data = request.get_json()
    
    # Load from database instead of JSON
    accommodations = fetch_from_postgres()
    
    # Create recommender
    recommender = AccommodationRecommender(accommodations)
    
    # Generate recommendations
    results = recommender.recommend(
        budget_min=data['budget_min'],
        budget_max=data['budget_max'],
        # ... other params from request
    )
    
    return jsonify(results)
```

**Database Query** (via Prisma):
```typescript
// Next.js API route: /api/ml/recommendations/accommodations
const accommodations = await prisma.accommodation.findMany({
  select: {
    id: true,
    name: true,
    location: true,
    province: true,
    price_range_min: true,
    price_range_max: true,
    amenities: true,
    interests: true,
    travel_style: true,
    group_size: true,
    rating: true,
    prior_bookings: true,
    // Availability logic would be more complex
  }
});

// Forward to ML service
const response = await fetch('ML_SERVICE_URL/recommendations/accommodations', {
  method: 'POST',
  body: JSON.stringify({ accommodations, user_preferences })
});
```

**Frontend Integration** (Next.js):
```typescript
// Call from React component
const recommendations = await fetch('/api/ml/recommendations/accommodations', {
  method: 'POST',
  body: JSON.stringify({
    budget_min: 5000,
    budget_max: 15000,
    required_amenities: ['wifi', 'pool'],
    interests: ['coastal', 'luxury'],
    travel_style: 'romantic',
    group_size: 2
  })
});
```

## Known Limitations & Future Improvements

### Current Limitations
1. **Cold Start**: No handling for new accommodations with 0 prior bookings (they get low popularity scores)
2. **Static Weights**: Weights are hardcoded; no A/B testing or personalization
3. **No User History**: Doesn't consider user's past bookings or preferences
4. **Simple Location**: Doesn't use actual distances (city/province tiers only)
5. **Availability**: Mock boolean field; real availability needs date range logic

### Suggested Improvements
1. **Collaborative Filtering**: Add user-user or item-item similarity once we have booking history
2. **Learning to Rank**: Replace weighted scoring with learned model (LambdaMART, XGBoost)
3. **Personalization**: Adapt weights per user segment or individual
4. **Geospatial**: Use lat/lng with Haversine distance for accurate location scoring
5. **Temporal**: Consider seasonality, booking trends, price fluctuations
6. **Diversity**: Add diversity penalty to avoid recommending too similar items
7. **Explainability**: Enhance reason generation with more contextual explanations
8. **Caching**: Cache recommendations per (user_profile, query) for common queries
9. **A/B Testing**: Infrastructure to test different weight configurations
10. **Feedback Loop**: Collect click/booking data to retrain and improve

## Files Created

1. ✅ `/home/gihan/WBTH/apps/ml/data_generator.py` (242 lines)
2. ✅ `/home/gihan/WBTH/apps/ml/recommender.py` (489 lines)
3. ✅ `/home/gihan/WBTH/apps/ml/evaluation.py` (287 lines)
4. ✅ `/home/gihan/WBTH/apps/ml/test_recommender.py` (378 lines)
5. ✅ `/home/gihan/WBTH/apps/ml/requirements.txt` (updated)
6. ✅ `/home/gihan/WBTH/packages/prisma/schema.prisma` (travel_style field added)

**Total Lines of Code**: ~1400 lines

## Next Steps

1. ⚠️ **Install Python dependencies** (see Installation Status above)
2. ▶️ **Generate mock data**: `python3 data_generator.py`
3. ▶️ **Run recommender**: `python3 recommender.py`
4. ▶️ **Run evaluation**: `python3 evaluation.py`
5. ▶️ **Run tests**: `python3 -m pytest test_recommender.py -v`
6. ▶️ **Review metrics** and adjust weights if needed
7. ▶️ **Update `/home/gihan/WBTH/tasks.md`** to mark task as complete

---

**Implementation Date**: 2025-12-03
**Phase**: 1 (Testing Phase - Standalone)
**Status**: ✅ Code Complete, ⚠️ Dependencies Pending, 🔄 Testing Pending
