#!/bin/bash
set -e

echo "Building Prisma package..."
tsc && prisma generate

echo "Creating Prisma symlink..."
cd ../../node_modules/@prisma
ln -sf ../../.prisma .prisma || true

echo "Prisma build complete!"
