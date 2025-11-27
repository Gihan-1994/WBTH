#!/bin/bash

# Reset and reseed the database
echo "🔄 Resetting database..."

cd "$(dirname "$0")/.." || exit 1

# Run migrations
echo "📋 Running Prisma migrations..."
cd packages/prisma
npx prisma generate
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
yarn seed

echo "✅ Database reset complete!"
