# Render Deployment Guide for WBTH ML Service

Complete guide to deploying your Flask ML service on Render.com (100% free, no credit card required).

## Why Render?

- ✅ **Completely free tier** (750 hours/month)
- ✅ **No credit card required**
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ Docker support
- ✅ Built-in health checks

**Note:** Free tier services spin down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds (cold start).

---

## Prerequisites

- GitHub account
- Your code pushed to GitHub
- Neon database set up (from ACCOUNT_SETUP.md)

---

## Step 1: Create Render Account

### 1.1 Sign Up

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started"**
3. Sign up with **GitHub** (recommended)
4. Authorize Render to access your GitHub repositories

✅ **No credit card required!**

---

## Step 2: Deploy ML Service

### 2.1 Create New Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - If not connected, click **"Connect account"** → Authorize GitHub
   - Select your WBTH repository
3. Click **"Connect"** next to your repository

### 2.2 Configure Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `wbth-ml-service`
- **Region**: Choose closest to your users
  - `Oregon (US West)` - Good for US/global
  - `Singapore` - Good for Asia
  - `Frankfurt` - Good for Europe
- **Branch**: `main`
- **Root Directory**: `apps/ml`

**Build Settings:**
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python api.py`

**Instance Type:**
- **Plan**: `Free` ✅

### 2.3 Add Environment Variables

Scroll down to **"Environment Variables"** section and add:

| Key | Value |
|-----|-------|
| `FLASK_PORT` | `8080` |
| `DATABASE_URL` | Your Neon connection string |
| `PYTHON_VERSION` | `3.11.0` |

**Example DATABASE_URL:**
```
postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/wbth?sslmode=require
```

### 2.4 Advanced Settings (Optional)

- **Health Check Path**: `/health`
- **Auto-Deploy**: `Yes` (deploys automatically on git push)

### 2.5 Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying
3. Wait 3-5 minutes for first deployment
4. You'll see build logs in real-time

---

## Step 3: Get Your Service URL

After deployment completes:

1. Your service URL will be shown at the top:
   ```
   https://wbth-ml-service.onrender.com
   ```
2. **Copy this URL** - you'll need it for Vercel environment variables

### 3.1 Test Your Service

```bash
# Test health endpoint
curl https://wbth-ml-service.onrender.com/health

# Expected response:
{"status":"ok"}
```

### 3.2 Test Recommendations

```bash
# Test accommodation recommendations
curl -X POST https://wbth-ml-service.onrender.com/api/recommendations/accommodations \
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

---

## Step 4: Update Vercel Environment Variables

Now update your frontend to use the Render ML service:

```bash
# Add ML service URL to Vercel
vercel env add ML_SERVICE_URL production

# When prompted, enter:
https://wbth-ml-service.onrender.com
```

Or in Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add `ML_SERVICE_URL` = `https://wbth-ml-service.onrender.com`

---

## Understanding Render Free Tier

### What You Get (Free)

- ✅ 750 hours/month (enough for 1 service running 24/7)
- ✅ Automatic HTTPS
- ✅ Auto-deploy from GitHub
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ✅ Unlimited bandwidth

### Limitations

**Cold Starts:**
- Service spins down after **15 minutes of inactivity**
- First request after spin-down takes **~30 seconds**
- Subsequent requests are instant

**How to Handle Cold Starts:**

1. **Accept it** (fine for MVP/low traffic)
2. **Keep-alive ping** (optional):
   ```bash
   # Ping every 10 minutes to keep service warm
   # Add to cron job or use a service like cron-job.org
   */10 * * * * curl https://wbth-ml-service.onrender.com/health
   ```
3. **Upgrade to paid** ($7/month for always-on service)

---

## Automatic Deployments

### How It Works

Render automatically deploys when you push to GitHub:

```bash
# Make changes to ML service
cd apps/ml
# ... make changes ...

# Commit and push
git add .
git commit -m "Update ML service"
git push origin main

# Render automatically deploys! 🚀
```

### Monitor Deployments

1. Go to Render Dashboard
2. Click on your service
3. View **"Events"** tab for deployment history
4. View **"Logs"** tab for runtime logs

---

## Monitoring & Logs

### View Logs

**In Render Dashboard:**
1. Go to your service
2. Click **"Logs"** tab
3. See real-time logs

**Via CLI (optional):**
```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# View logs
render logs wbth-ml-service
```

### Health Checks

Render automatically monitors your `/health` endpoint:
- Checks every 30 seconds
- If fails 3 times, restarts service
- View status in dashboard

---

## Troubleshooting

### Issue: Build fails

**Check:**
1. Verify `requirements.txt` is in `apps/ml/`
2. Check build logs for specific error
3. Ensure Python version is compatible

**Solution:**
```bash
# Test build locally
cd apps/ml
pip install -r requirements.txt
python api.py
```

### Issue: Service returns 500 errors

**Check:**
1. View logs in Render dashboard
2. Verify `DATABASE_URL` is set correctly
3. Check database connection

**Solution:**
```bash
# Test database connection
psql "your-database-url"
```

### Issue: Cold start is too slow

**Options:**
1. **Accept it** (fine for MVP)
2. **Keep-alive ping** (ping every 10 min)
3. **Upgrade to paid** ($7/month for always-on)

### Issue: "Module not found" error

**Solution:**
Add missing package to `requirements.txt`:
```bash
cd apps/ml
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

---

## Upgrading (Optional)

### When to Upgrade

Consider upgrading to paid plan ($7/month) if:
- ❌ Cold starts are affecting user experience
- ❌ Need more than 512 MB RAM
- ❌ Need faster CPU
- ❌ High traffic (> 1000 requests/day)

### Paid Plans

| Plan | Price | RAM | CPU | Cold Starts |
|------|-------|-----|-----|-------------|
| **Free** | $0 | 512 MB | 0.1 | Yes (15 min) |
| **Starter** | $7/mo | 512 MB | 0.5 | No |
| **Standard** | $25/mo | 2 GB | 1.0 | No |

---

## Render vs Google Cloud Run

| Feature | Render Free | Cloud Run Free |
|---------|-------------|----------------|
| **Credit Card** | ❌ Not required | ✅ Required |
| **Free Tier** | 750 hrs/month | 2M requests/month |
| **Cold Starts** | 15 min inactivity | Immediate |
| **Setup** | 5 minutes | 15 minutes |
| **Best For** | MVP, low traffic | Production, high traffic |

---

## Cost Estimates

### Free Tier (Your Current Setup)

- ML Service (Render): $0
- Frontend (Vercel): $0
- Database (Neon): $0
- **Total: $0/month** ✅

### If You Outgrow Free Tier

- ML Service (Render Starter): $7/month
- Frontend (Vercel Pro): $20/month
- Database (Neon Pro): $19/month
- **Total: ~$46/month**

---

## GitHub Actions Integration (Optional)

You can still use GitHub Actions with Render!

### Option 1: Let Render Handle Deployments (Recommended)

Render auto-deploys on push to main - no GitHub Actions needed!

### Option 2: Manual Control with GitHub Actions

Create `.github/workflows/deploy-render.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]
    paths: ['apps/ml/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

Get deploy hook from Render Dashboard → Settings → Deploy Hook

---

## Quick Reference

### Your Service Details

```bash
# Service URL
https://wbth-ml-service.onrender.com

# Health Check
curl https://wbth-ml-service.onrender.com/health

# View Logs
# Go to: https://dashboard.render.com → Your Service → Logs
```

### Common Commands

```bash
# Deploy (automatic on git push)
git push origin main

# View service status
# Dashboard: https://dashboard.render.com

# Update environment variables
# Dashboard → Service → Environment → Add Variable
```

---

## Next Steps

1. ✅ ML service deployed on Render
2. ✅ Update `ML_SERVICE_URL` in Vercel
3. ✅ Deploy frontend to Vercel
4. ✅ Test end-to-end workflow

---

## Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)

**🎉 Your ML service is now deployed for free on Render!**
