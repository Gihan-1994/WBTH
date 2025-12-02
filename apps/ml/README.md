# ML Accommodation Recommendation System

## Quick Start

```bash
# Install python3-venv if not already installed
sudo apt install python3.12-venv

# Run setup script (creates venv, installs packages, tests everything)
./setup.sh

# OR manually:
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/python data_generator.py
./venv/bin/python recommender.py
./venv/bin/python -m pytest test_recommender.py -v
./venv/bin/python evaluation.py
```

## What's Included

- **data_generator.py** - Generates 1000 mock accommodations
- **recommender.py** - Hybrid recommendation engine (filters + weighted scoring)
- **evaluation.py** - Metrics evaluation (Precision@k, Recall@k, NDCG)
- **test_recommender.py** - Unit tests (23 test cases)

## Results Summary

✅ All 23 unit tests passed
✅ Mock data: 1000 accommodations generated
✅ Evaluation metrics (average across 5 scenarios):
  - Precision@5: 0.96
  - Precision@10: 0.80
  - NDCG@5: 0.71
  - NDCG@10: 0.68

## Documentation

See [ML_progress.md](ML_progress.md) for:
- Implementation details
- Algorithm explanation
- Integration plan for Next.js/Prisma
- Future improvements

## Task Status

✅ **COMPLETE** - ML Recommendation System (Phase 1)

All requirements from tasks.md fulfilled:
- ✅ Implemented hybrid algorithm per architecture spec 4.1
- ✅ Generated 1000 mock data records
- ✅ Created recommendation engine with scoring
- ✅ Evaluated with multiple metrics
- ✅ Standalone Python app (no DB/frontend)
- ✅ Comprehensive documentation
