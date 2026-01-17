#!/bin/bash

# WBTH Production Database Migration Script
# This script runs Prisma migrations on the production database

set -e

echo "🗄️  WBTH Production Database Migration"
echo "======================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set"
    echo "Set it with: export DATABASE_URL='your-production-database-url'"
    exit 1
fi

echo "⚠️  WARNING: This will run migrations on the production database!"
echo "Database: ${DATABASE_URL%%\?*}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Migration cancelled"
    exit 0
fi

# Navigate to prisma package
cd "$(dirname "$0")/../packages/prisma"

# Run migrations
echo "🔄 Running migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "🔨 Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Migration successful!"
