# Renaming "location" to "district" - Complete Guide

## Overview
Successfully renamed all "location" references to "district" throughout the WBTH recommendation system to accurately reflect Sri Lankan geography.

## Changes Made

### 1. ✅ Database Schema (`schema.prisma`)
- **Field renamed**: `location` → `district` in `Accommodation` model
- **Migration needed**: Run the SQL migration before deploying

### 2. ✅ Flask API (`apps/ml/api.py`)
- `location` parameter → `district`
- `location_city` → `district`
- `location_province` → `province`
- All docstrings and comments updated

### 3. ✅ Recommender (`apps/ml/recommender.py`)
- `location_city` → `district`
- `location_province` → `province`
- All field references in dictionaries updated
- Scoring and filtering logic updated

### 4. ✅ Data Generator (`apps/ml/data_generator.py`)
- Mock data generation updated to use `district` field
- **New mock data generated** with correct field names

### 5. ✅ Frontend (`apps/web/app/recommendations/page.tsx`)
- `location_city` → `district` in state and API calls
- `location_province` → `province`
- UI labels updated:
  - "City (Optional)" → "District (Optional)"
  - "Any City" → "Any District"
- Constant renamed: `SRI_LANKA_CITIES` → `SRI_LANKA_DISTRICTS`

## 📋 Migration Steps

### Step 1: Run Database Migration

```bash
# Option 1: Using psql directly
psql $DATABASE_URL -f migration_location_to_district.sql

# Option 2: Using Prisma migrate
cd /home/gihan/WBTH/packages/prisma
npx prisma migrate dev --name rename_location_to_district
```

### Step 2: Regenerate Prisma Client

```bash
cd /home/gihan/WBTH/packages/prisma
npx prisma generate
```

### Step 3: Restart Flask API

```bash
cd /home/gihan/WBTH/apps/ml
source venv/bin/activate
# Stop old process (Ctrl+C)
python api.py
```

### Step 4: Restart Frontend (if needed)

The Next.js dev server should hot-reload automatically, but if issues occur:
```bash
cd /home/gihan/WBTH/apps/web
# Stop and restart
yarn dev
```

## 🧪 Testing

### Test 1: Check Mock Data
```bash
cd /home/gihan/WBTH/apps/ml
python -c "import json; data=json.load(open('mock_accommodations.json')); print('Field check:', 'district' in data[0])"
```
Expected: `Field check: True`

### Test 2: Test API
```bash
curl -X POST http://localhost:5000/api/recommendations/accommodations \
  -H "Content-Type: application/json" \
  -d '{
    "budget_min": 1000,
    "budget_max": 5000,
    "district": "Colombo",
    "province": "Western",
    "group_size": 2
  }'
```

### Test 3: Frontend
1. Open http://localhost:3000/recommendations
2. Check labels show "District (Optional)" and "Any District"
3. Select a district and search
4. Verify results show correct district names

## 📝 API Changes

### Before:
```json
{
  "location_city": "Colombo",
  "location_province": "Western"
}
```

### After:
```json
{
  "district": "Colombo",
  "province": "Western"
}
```

## ⚠️ Breaking Changes

**Frontend API calls** must now use:
- `district` instead of `location_city`
- `province` instead of `location_province`

**Database queries** must reference:
- `accommodations.district` instead of `accommodations.location`

## ✅ Verification Checklist

- [x] Prisma schema updated
- [x] Flask API updated
- [x] Recommender updated  
- [x] Data generator updated
- [x] Mock data regenerated
- [x] Frontend updated
- [x] Migration script created
- [ ] Database migration executed
- [ ] Prisma client regenerated
- [ ] Flask API restarted
- [ ] Frontend tested

## 🎯 Next Steps

1. **Execute the database migration**
2. **Regenerate Prisma client**
3. **Restart Flask API**
4. **Test the frontend thoroughly**

All code changes are complete and ready to deploy!
