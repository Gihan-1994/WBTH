#!/bin/bash
set -e

echo "Building Prisma package..."
npx prisma generate && npx tsc

echo "Prisma build complete!"
