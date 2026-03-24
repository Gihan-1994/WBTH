#!/bin/bash
set -e

echo "Starting custom Vercel build process..."

# 1. Generate Prisma Client
echo "Generating Prisma Client..."
cd ../../packages/prisma

# For local development, read DATABASE_URL from .env.local if exists
if [ -f ../../.env.local ] && [ -z "$DATABASE_URL" ]; then
  DATABASE_URL="$(grep DATABASE_URL ../../.env.local | cut -d'=' -f2- | tr -d '"')"
    export DATABASE_URL
fi

npx prisma generate
cd ../../apps/web

# 2. Run Next.js Build
echo "Building Next.js app..."
next build

echo "Build process complete!"
