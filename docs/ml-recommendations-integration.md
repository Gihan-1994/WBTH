# ML Recommendations Integration - Documentation

## Overview
This document provides instructions for running and testing the ML-based accommodation recommendation system integrated with the WBTH platform.

## Architecture

### Components
1. **Flask Backend API** (`/home/gihan/WBTH/apps/ml/api.py`)
   - Serves ML recommendations via REST API
   - Integrates with PostgreSQL database
   - Implements hybrid data approach (real + mock fallback)
   - Port: 5000

2. **Next.js Frontend** (`/home/gihan/WBTH/apps/web/app/recommendations/page.tsx`)
   - User interface for setting preferences
   - Real-time API integration
   - Results display with booking options
   - Route: `/recommendations`

3. **ML Recommendation Engine** (`/home/gihan/WBTH/apps/ml/recommender.py`)
   - Hybrid rule-based filtering + weighted scoring
   - 8-factor scoring algorithm
   - Reason generation for transparency

## Quick Start

### 1. Install Flask Dependencies

```bash
cd /home/gihan/WBTH/apps/ml
source venv/bin/activate
pip install psycopg2-binary flask-cors python-dotenv
```

### 2. Configure Environment (Optional)

Create `/home/gihan/WBTH/apps/ml/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/wbth
FLASK_PORT=5000
```

Or use the defaults already configured in `api.py`.

### 3. Start Flask API

```bash
cd /home/gihan/WBTH/apps/ml
source venv/bin/activate
python api.py
```

Expected output:
```
Starting Flask API on port 5000
Database URL: postgresql://user:password@localhost:5432/wbth
 * Running on http://0.0.0.0:5000
```

### 4. Access the Application

With Next.js dev server running (already active):
1. Open http://localhost:3000
2. Click on "For You" section
3. Set your preferences and get recommendations

## API Reference

### POST /api/recommendations/accommodations

Generate accommodation recommendations based on user preferences.

**Request Body**:
```json
{
  "budget_min": 5000,
  "budget_max": 15000,
  "required_amenities": ["wifi", "pool"],
  "interests": ["coastal", "luxury"],
  "travel_style": "luxury",
  "group_size": 2,
  "location_city": "Colombo",
  "location_province": "Western",
  "city_only": false,
  "top_k": 10
}
```

**Response**:
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "name": "Luxury Beach Resort",
      "location": "Colombo",
      "province": "Western",
      "price_range_min": 8000,
      "price_range_max": 12000,
      "rating": 4.5,
      "score": 0.847,
      "reasons": [
        "Within Colombo",
        "Matches coastal & luxury",
        "Excellent rating (4.5/5.0)"
      ],
      "in_system": true
    }
  ],
  "total_candidates": 25,
  "filters_applied": [
    "Budget: 5000-15000 LKR",
    "Group size: 2",
    "Amenities: wifi, pool",
    "Preferred location: Colombo",
    "Availability: Available"
  ]
}
```

## Features

### Hybrid Data Approach
- **Real Data**: Fetched from PostgreSQL `accommodations` table
- **Mock Data**: Loaded from `mock_accommodations.json` when < 5 real results
- **Flagging**: `in_system` field distinguishes real vs mock data

### Frontend Features
- **Filters**: Budget, location, amenities, travel style, interests, group size
- **Results**: Sorted by match score with detailed reasons
- **Actions**: "Book Now" for registered accommodations, badge for mock data
- **Tabs**: Accommodation (active), Guide (coming soon)

### Recommendation Algorithm
8-factor weighted scoring:
1. Interests match (20%)
2. Travel style match (5%)
3. Price alignment (10%)
4. Amenities coverage (15%)
5. Location proximity (15%)
6. Group size fit (10%)
7. Rating (20%)
8. Popularity (5%)

## Troubleshooting

### Flask API won't start
- Ensure virtual environment is activated
- Check database connection: `psql $DATABASE_URL`
- Verify port 5000 is available: `lsof -i :5000`

### No recommendations returned
- Check Flask terminal for errors
- Verify database has accommodations: `SELECT COUNT(*) FROM accommodations;`
- Try less restrictive filters

### Frontend connection error
- Ensure Flask API is running on port 5000
- Check browser console for CORS errors
- Verify `NEXT_PUBLIC_FLASK_API_URL` environment variable

## Next Steps

1. **Add Real Accommodations**: Populate database via provider dashboard
2. **Tune ML Weights**: Adjust weights in `recommender.py` based on user feedback
3. **Implement Guide Recommendations**: Add guide matching algorithm
4. **Add User Preferences**: Store user preferences for personalized defaults
