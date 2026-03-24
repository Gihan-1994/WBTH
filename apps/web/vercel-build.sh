#!/bin/bash
set -e

echo "Starting custom Vercel build process..."

# 1. Generate Prisma Client with DATABASE_URL from environment
echo "Generating Prisma Client..."
cd ../../packages/prisma
DATABASE_URL="$DATABASE_URL" npx prisma generate
cd ../../apps/web

# 2. Run Next.js Build
echo "Building Next.js app..."
next build

echo "Build process complete!"
