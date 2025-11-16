#!/usr/bin/env bash
set -euo pipefail
yarn -C packages/prisma prisma generate
yarn -C apps/web dev &
python apps/ml/wbth_ml/api.py
