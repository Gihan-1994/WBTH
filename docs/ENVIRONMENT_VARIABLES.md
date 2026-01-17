# Environment Variables Guide

Understanding where to put environment variables in the WBTH project.

## Quick Answer

**For production deployment:**
- Put your variables in `.env.production` in the **project root**
- This file is already in `.gitignore` and won't be committed

## File Locations & Purposes

### Root Directory Files

```
/home/gihan/WBTH/
├── .env                    # Development (local)
├── .env.production         # Production values (your case!)
└── .env.production.local   # Alternative (also works)
```

**When to use:**
- `.env` - Local development
- `.env.production` - Production database URL and secrets
- `.env.production.local` - Alternative to `.env.production` (both work the same)

### Prisma Package Files

```
/home/gihan/WBTH/packages/prisma/
└── .env                    # Optional, for Prisma-specific commands
```

**When to use:**
- Only if you want to run Prisma commands directly from `packages/prisma/` directory
- Not required if you export DATABASE_URL before running commands

## How Environment Variables Are Loaded

### For Your Applications

**Next.js (Frontend):**
```bash
# Reads from root .env files automatically
cd apps/web
yarn dev  # Automatically loads .env, .env.local, etc.
```

**Flask (ML Service):**
```python
# In apps/ml/api.py
from dotenv import load_dotenv
load_dotenv()  # Loads from apps/ml/.env or root .env

DATABASE_URL = os.getenv('DATABASE_URL')
```

### For Prisma Commands

Prisma looks for `.env` in the `prisma` directory OR uses exported environment variables.

**Option 1: Export from .env.production (Recommended)**
```bash
# Load all variables from .env.production
export $(cat .env.production | xargs)

# Now run Prisma commands
cd packages/prisma
npx prisma migrate deploy
```

**Option 2: Copy to packages/prisma/.env**
```bash
# Copy your production env to Prisma directory
cp .env.production packages/prisma/.env

# Run Prisma commands
cd packages/prisma
npx prisma migrate deploy
```

**Option 3: Direct export**
```bash
# Export just DATABASE_URL
export DATABASE_URL="postgresql://user:pass@host/db"

# Run Prisma commands
cd packages/prisma
npx prisma migrate deploy
```

## Your Current Setup

You have `.env.production` in the root with:
```bash
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/wbth?sslmode=require"
```

This is **perfect**! ✅

### To Run Migrations

```bash
# From project root
export $(cat .env.production | xargs)
cd packages/prisma
npx prisma migrate deploy
```

### To Run Development Server

```bash
# The apps will automatically load .env.production
# Or create .env for development:
cp .env.production .env

# Start all services
./scripts/start-all.sh
```

## Required Environment Variables

### For All Environments

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/wbth?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # or your production URL

# ML Service
ML_SERVICE_URL="http://localhost:5000"  # or your Render URL

# Email (optional)
EMAIL_SERVER_USER="user@example.com"
EMAIL_SERVER_PASSWORD="password"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@example.com"
```

### For ML Service (Render)

When deploying to Render, you set these in the Render dashboard:
```bash
DATABASE_URL="your-neon-connection-string"
FLASK_PORT="8080"
```

### For Frontend (Vercel)

When deploying to Vercel, you set these via CLI or dashboard:
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add ML_SERVICE_URL production
# ... etc
```

## Best Practices

### ✅ DO

- Keep `.env.production` in root directory
- Add `.env.production` to `.gitignore` (already done)
- Use `export $(cat .env.production | xargs)` to load variables
- Generate strong secrets: `openssl rand -base64 32`
- Use different values for development and production

### ❌ DON'T

- Commit `.env.production` to Git
- Share your `.env.production` file publicly
- Use the same NEXTAUTH_SECRET in dev and production
- Hardcode secrets in your code

## Troubleshooting

### Issue: "DATABASE_URL is not defined"

**When running Prisma commands:**
```bash
# Solution: Export the variable first
export $(cat .env.production | xargs)
cd packages/prisma
npx prisma migrate deploy
```

**When running apps:**
```bash
# Solution: Make sure .env or .env.production exists in root
ls -la .env*

# If missing, create it:
echo 'DATABASE_URL="your-connection-string"' > .env.production
```

### Issue: "Cannot find module 'dotenv'"

```bash
# Solution: Install dotenv
yarn add dotenv

# Or for ML service
cd apps/ml
pip install python-dotenv
```

### Issue: Variables not loading in Next.js

Next.js requires specific prefixes for client-side variables:
```bash
# Server-side (API routes) - no prefix needed
DATABASE_URL="..."

# Client-side - must start with NEXT_PUBLIC_
NEXT_PUBLIC_API_URL="..."
```

## Quick Reference

### Load .env.production

```bash
# Bash/Linux
export $(cat .env.production | xargs)

# Or one variable at a time
export DATABASE_URL="your-value"
```

### Check Current Environment Variables

```bash
# Show all
env

# Show specific variable
echo $DATABASE_URL

# Check if variable is set
[ -z "$DATABASE_URL" ] && echo "Not set" || echo "Set to: $DATABASE_URL"
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate random password
openssl rand -hex 16
```

## Summary

**Your setup is correct!** ✅

- `.env.production` in root: Perfect for production values
- Just remember to export variables before running Prisma commands
- For deployment, set variables in Render/Vercel dashboards

**To use your .env.production:**
```bash
# Load variables
export $(cat .env.production | xargs)

# Run any command that needs them
cd packages/prisma
npx prisma migrate deploy
```
