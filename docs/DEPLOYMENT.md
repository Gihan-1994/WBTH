# WBTH Deployment Guide

This guide covers the complete deployment process for the WBTH tourism platform.

## Architecture

- **Frontend**: Next.js app deployed on Vercel
- **ML Service**: Flask API deployed on Google Cloud Run
- **Database**: Managed PostgreSQL (Neon/Supabase/Cloud SQL)

## Prerequisites

### Accounts Required
- Vercel account ([vercel.com](https://vercel.com))
- Google Cloud Platform account ([cloud.google.com](https://cloud.google.com))
- PostgreSQL hosting account (Neon/Supabase/Cloud SQL)

### CLI Tools
- Node.js 18+ and Yarn
- Vercel CLI: `npm i -g vercel`
- Google Cloud SDK: [Install Guide](https://cloud.google.com/sdk/docs/install)
- Docker: [Install Guide](https://docs.docker.com/get-docker/)

## Step 1: Database Setup

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project named "wbth"
3. Copy the connection string (looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/wbth`)
4. Save this as your `DATABASE_URL`

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project named "wbth"
3. Go to Settings → Database → Connection string → URI
4. Copy the connection string and save as `DATABASE_URL`

### Option C: Google Cloud SQL

1. In GCP Console, go to SQL → Create Instance
2. Choose PostgreSQL, select version 16
3. Configure instance (name: wbth-db, region: us-central1)
4. Create database named "wbth"
5. Get connection string from instance details

## Step 2: Run Database Migrations

```bash
# Set your production database URL
export DATABASE_URL="your-production-database-url"

# Run migrations
./scripts/migrate-production.sh
```

## Step 3: Deploy ML Service to Google Cloud Run

### Initial Setup

```bash
# Install Google Cloud SDK (if not already installed)
# Follow: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create wbth-production --name="WBTH Production"

# Set the project
gcloud config set project wbth-production

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Deploy ML Service

```bash
# Set environment variables
export GCP_PROJECT_ID="wbth-production"
export GCP_REGION="us-central1"
export DATABASE_URL="your-production-database-url"

# Make deploy script executable
chmod +x scripts/deploy-ml.sh

# Deploy
./scripts/deploy-ml.sh
```

### Verify ML Service

```bash
# Get the service URL
SERVICE_URL=$(gcloud run services describe wbth-ml-service \
  --region us-central1 \
  --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Expected response: {"status":"ok"}
```

## Step 4: Deploy Frontend to Vercel

### Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login
```

### Configure Environment Variables

Before deploying, set up environment variables in Vercel:

```bash
# Link your project
vercel link

# Add environment variables
vercel env add DATABASE_URL production
# Paste your production database URL

vercel env add NEXTAUTH_SECRET production
# Generate with: openssl rand -base64 32

vercel env add NEXTAUTH_URL production
# Will be your Vercel URL (e.g., https://wbth.vercel.app)

vercel env add ML_SERVICE_URL production
# Paste your Cloud Run service URL

vercel env add EMAIL_SERVER_USER production
vercel env add EMAIL_SERVER_PASSWORD production
vercel env add EMAIL_SERVER_HOST production
vercel env add EMAIL_SERVER_PORT production
vercel env add EMAIL_FROM production
```

### Deploy

```bash
# Make deploy script executable
chmod +x scripts/deploy-frontend.sh

# Deploy to production
./scripts/deploy-frontend.sh
```

## Step 5: Post-Deployment Configuration

### Update NEXTAUTH_URL

After first deployment, update the `NEXTAUTH_URL` environment variable in Vercel with your actual deployment URL:

```bash
vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter: https://your-actual-domain.vercel.app
```

### Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` to use custom domain

## Step 6: Verification

### Test Database Connectivity

```bash
# From your local machine
export DATABASE_URL="your-production-database-url"
cd packages/prisma
npx prisma studio
```

### Test ML Service

```bash
# Test accommodation recommendations
curl -X POST $ML_SERVICE_URL/api/recommendations/accommodations \
  -H "Content-Type: application/json" \
  -d '{
    "budget_min": 5000,
    "budget_max": 15000,
    "required_amenities": ["wifi"],
    "interests": ["coastal"],
    "travel_style": "budget",
    "group_size": 2,
    "top_k": 5
  }'
```

### Test Frontend

1. Visit your Vercel URL
2. Test user registration and login
3. Test booking flows
4. Verify ML recommendations are working

## Monitoring and Logs

### Google Cloud Run Logs

```bash
# View ML service logs
gcloud run services logs read wbth-ml-service \
  --region us-central1 \
  --limit 50
```

### Vercel Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment → View Function Logs

## Troubleshooting

### ML Service Issues

**Problem**: Service returns 500 errors

**Solution**:
```bash
# Check logs
gcloud run services logs read wbth-ml-service --region us-central1

# Verify environment variables
gcloud run services describe wbth-ml-service --region us-central1
```

### Database Connection Issues

**Problem**: "Connection refused" or "Connection timeout"

**Solution**:
- Verify DATABASE_URL is correct
- Check if database allows connections from Cloud Run/Vercel IPs
- For Neon/Supabase: Ensure connection pooling is enabled
- For Cloud SQL: Enable Cloud SQL Admin API

### Frontend Build Failures

**Problem**: Build fails on Vercel

**Solution**:
```bash
# Test build locally
cd apps/web
yarn build

# Check for TypeScript errors
yarn typecheck
```

## Cost Estimates

### Free Tier (Development/Small Scale)

- **Neon**: Free tier (0.5 GB)
- **Vercel**: Free tier (100 GB bandwidth)
- **Cloud Run**: Free tier (2M requests/month)
- **Total**: $0/month

### Production (Medium Scale)

- **Neon Pro**: $19/month
- **Vercel Pro**: $20/month
- **Cloud Run**: ~$10-30/month (based on usage)
- **Total**: ~$50-70/month

## Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml` for automated deployments on push to main branch.

## Support

For issues or questions:
- Check logs in Vercel and Google Cloud Console
- Review environment variables
- Ensure all services can communicate with the database
