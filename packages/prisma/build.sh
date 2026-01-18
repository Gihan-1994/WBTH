#!/bin/bash
set -e

echo "Building Prisma package..."
npx tsc && npx prisma generate

echo "Prisma build complete!"
