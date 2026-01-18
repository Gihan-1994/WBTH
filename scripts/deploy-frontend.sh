#!/bin/bash

# WBTH Frontend Deployment Script for Vercel
# This script deploys the Next.js frontend to Vercel

set -e

echo "🚀 WBTH Frontend Deployment to Vercel"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI is not installed"
    echo "Install with: npm i -g vercel"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Logging in to Vercel..."
    vercel login
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Deploy to production from current branch
echo "🚢 Deploying to Vercel from branch: $CURRENT_BRANCH..."
vercel --prod

echo ""
echo "✅ Deployment successful!"
echo ""
echo "📝 Next steps:"
echo "1. Verify environment variables in Vercel dashboard"
echo "2. Test the deployment"
echo "3. Configure custom domain (if needed)"
