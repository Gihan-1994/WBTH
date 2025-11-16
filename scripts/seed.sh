#!/usr/bin/env bash
set -euo pipefail
yarn -C packages/prisma prisma db seed
