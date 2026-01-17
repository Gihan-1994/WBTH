# Account Setup Guide - Start Here!

This guide will walk you through setting up all the accounts you need to deploy WBTH, **starting from scratch**.

## Overview

You'll need to set up 3 accounts:
1. **Neon** (Database) - 5 minutes ⭐ Start here
2. **Vercel** (Frontend) - 5 minutes
3. **Google Cloud Platform** (ML Service) - 10 minutes

**Total time: ~20 minutes**

---

## Step 1: Set Up Neon (Database) ⭐ START HERE

### Why Neon?
- ✅ Free tier (0.5 GB storage)
- ✅ Easiest setup
- ✅ Best Vercel integration
- ✅ Serverless (auto-scales)
- ✅ No credit card required for free tier

### Setup Instructions

#### 1.1 Create Account

1. Go to [https://neon.tech](https://neon.tech)
2. Click **"Sign Up"**
3. Sign up with:
   - GitHub (recommended - fastest)
   - OR Google
   - OR Email

#### 1.2 Create Project

1. After login, click **"Create a project"**
2. Fill in:
   - **Project name**: `wbth` (or `wbth-production`)
   - **Region**: Choose closest to your users (e.g., `US East (Ohio)` or `Europe (Frankfurt)`)
   - **PostgreSQL version**: 16 (default)
3. Click **"Create project"**

#### 1.3 Get Connection String

1. After project creation, you'll see a **"Connection Details"** section
2. Copy the **"Connection string"** - it looks like:
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
3. **IMPORTANT**: Save this somewhere safe! You'll need it later.

#### 1.4 Rename Database (Optional but Recommended)

1. In Neon dashboard, go to **"Databases"** tab
2. The default database is named `neondb`
3. You can rename it to `wbth` for clarity:
   - Click on database → Settings → Rename to `wbth`
4. Update your connection string to use `wbth` instead of `neondb`

#### 1.5 Save Your Connection String

Create a file to save your credentials (don't commit this!):

```bash
# In your project root
echo "DATABASE_URL=\"your-connection-string-here\"" > .env.production
```

**Example:**
```bash
echo 'DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/wbth?sslmode=require"' > .env.production
```

**Note:** `.env.production` is already in your `.gitignore`, so it won't be committed to Git.

✅ **Neon Setup Complete!**

---

## Step 2: Set Up Vercel (Frontend)

### Why Vercel?
- ✅ Free tier (100 GB bandwidth/month)
- ✅ Made by Next.js creators
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy GitHub integration

### Setup Instructions

#### 2.1 Create Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with **GitHub** (recommended)
   - This will automatically connect your GitHub repos
4. Authorize Vercel to access your GitHub account

#### 2.2 Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Login
vercel login
```

Follow the prompts to authenticate.

#### 2.3 Link Your Project (Do This Later)

**Don't do this yet!** You'll do this when you're ready to deploy.

When ready:
```bash
cd /home/gihan/WBTH
vercel link
```

✅ **Vercel Setup Complete!**

---

## Step 3: Set Up Render (ML Service)

### Why Render?
- ✅ **Completely free tier** (750 hours/month)
- ✅ **No credit card required**
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ Easy setup

### Setup Instructions

#### 3.1 Create Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
   - This will automatically connect your GitHub repos
4. Authorize Render to access your GitHub account

✅ **Render Setup Complete!**

**Note:** You'll deploy the ML service later using the Render dashboard. See [docs/RENDER_DEPLOYMENT.md](file:///home/gihan/WBTH/docs/RENDER_DEPLOYMENT.md) for deployment instructions.

---

## Step 4: Install Required CLI Tools

### 4.1 Docker (Required for ML Service)

**Check if installed:**
```bash
docker --version
```

**If not installed:**

**Linux (Ubuntu/Debian):**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group (avoid sudo)
sudo usermod -aG docker $USER

# Log out and back in for group changes to take effect
```

**Verify:**
```bash
docker run hello-world
```

### 4.2 Vercel CLI (Already Done in Step 2.2)

```bash
npm install -g vercel
vercel login
```

### 4.3 Node.js & Yarn (Should Already Be Installed)

```bash
# Check versions
node --version  # Should be 18+
yarn --version

# If not installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn
```

---

## Step 5: Run Database Migrations

Now that you have a database, let's set it up!

### Option 1: Using .env.production (Recommended)

If you saved your DATABASE_URL in `.env.production` (in the root):

```bash
# Load environment variables from .env.production
export $(cat /home/gihan/WBTH/.env.production | xargs)

# Navigate to prisma package
cd /home/gihan/WBTH/packages/prisma

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify (optional - opens Prisma Studio)
npx prisma studio
```

### Option 2: Direct Export

Or export the DATABASE_URL directly:

```bash
# Set your database URL (use the one from Neon)
export DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/wbth?sslmode=require"

# Navigate to prisma package
cd /home/gihan/WBTH/packages/prisma

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy
```

✅ **Database Setup Complete!**

---

## Step 6: Test Local Setup

Before deploying to production, test everything locally:

```bash
# Go to project root
cd /home/gihan/WBTH

# Update .env with your production database
echo "DATABASE_URL=\"your-neon-connection-string\"" >> .env

# Start all services
./scripts/start-all.sh
```

Visit `http://localhost:3000` and verify:
- ✅ Frontend loads
- ✅ Can register a user
- ✅ Database connection works

---

## Summary: What You Now Have

| Service | Account | Status | What It's For |
|---------|---------|--------|---------------|
| **Neon** | ✅ Created | Free tier | PostgreSQL database |
| **Vercel** | ✅ Created | Free tier | Next.js frontend hosting |
| **Render** | ✅ Created | Free tier | ML service hosting |
| **Vercel CLI** | ✅ Installed | - | Vercel deployments |

---

## Next Steps

### Deploy ML Service to Render

Follow the detailed guide: [docs/RENDER_DEPLOYMENT.md](file:///home/gihan/WBTH/docs/RENDER_DEPLOYMENT.md)

**Quick steps:**
1. Go to [render.com](https://render.com) dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure service (see guide for details)
5. Add environment variables
6. Deploy!

### Deploy Frontend to Vercel

```bash
# Link project and deploy
cd /home/gihan/WBTH
vercel link
vercel --prod
```

---

## Troubleshooting

### Issue: "gcloud: command not found"

**Solution:**
```bash
# Install gcloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### Issue: "Docker daemon not running"

**Solution:**
```bash
# Start Docker
sudo systemctl start docker

# Enable on boot
sudo systemctl enable docker
```

### Issue: "Permission denied" when running Docker

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
```

### Issue: Database connection fails

**Solution:**
- Verify connection string is correct
- Check if `?sslmode=require` is at the end
- Ensure no extra spaces in connection string
- Test connection: `psql "your-connection-string"`

---

## Cost Tracking

### Current Setup (Free Tier)

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Neon | 0.5 GB storage | ~50 MB | $0 |
| Vercel | 100 GB bandwidth | ~5 GB | $0 |
| Cloud Run | 2M requests/month | ~10K | $0 |
| **Total** | | | **$0/month** |

### When You'll Need to Pay

- **Neon**: When you exceed 0.5 GB storage (~$19/month for Pro)
- **Vercel**: When you exceed 100 GB bandwidth (~$20/month for Pro)
- **Cloud Run**: When you exceed 2M requests (~$10-30/month)

**Estimated production cost: $50-70/month** (when you outgrow free tier)

---

## Quick Reference Card

Save this for later:

```bash
# Your Credentials (KEEP SECRET!)
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/wbth?sslmode=require"
GCP_PROJECT_ID="wbth-production-123456"

# Quick Deploy Commands
./scripts/deploy-ml.sh      # Deploy ML service
./scripts/deploy-frontend.sh # Deploy frontend

# Check Deployments
gcloud run services list     # List Cloud Run services
vercel ls                    # List Vercel deployments

# View Logs
gcloud run services logs read wbth-ml-service --region us-central1
vercel logs                  # Frontend logs
```

---

## Support

If you get stuck:
1. Check [docs/DEPLOYMENT.md](file:///home/gihan/WBTH/docs/DEPLOYMENT.md) for detailed guides
2. Check [docs/DEPLOYMENT_QUICK_REFERENCE.md](file:///home/gihan/WBTH/docs/DEPLOYMENT_QUICK_REFERENCE.md) for quick commands
3. Google the specific error message
4. Check service status pages:
   - [Neon Status](https://neonstatus.com)
   - [Vercel Status](https://www.vercel-status.com)
   - [Google Cloud Status](https://status.cloud.google.com)

---

**🎉 You're Ready to Deploy!**

Follow the steps in order, and you'll have all accounts set up in ~20 minutes.
