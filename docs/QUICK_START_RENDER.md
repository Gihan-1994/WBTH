# Quick Start: Deploy WBTH with Render (No Credit Card!)

The fastest way to deploy your WBTH project using **100% free services** with **no credit card required**.

## ⏱️ Total Time: ~30 minutes

---

## Step 1: Set Up Accounts (15 minutes)

### 1.1 Neon (Database) - 5 min

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create project "wbth"
4. **Copy connection string** - save it!

### 1.2 Vercel (Frontend) - 5 min

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Install CLI: `npm i -g vercel && vercel login`

### 1.3 Render (ML Service) - 5 min

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Done! (You'll deploy later)

---

## Step 2: Prepare Your Code (5 minutes)

### 2.1 Push to GitHub

```bash
cd /home/gihan/WBTH

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
# (Create repo on github.com first, then:)
git remote add origin https://github.com/YOUR_USERNAME/WBTH.git
git push -u origin main
```

### 2.2 Run Database Migrations

```bash
# Use your Neon connection string
export DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/wbth?sslmode=require"

cd packages/prisma
npx prisma migrate deploy
```

---

## Step 3: Deploy ML Service to Render (5 minutes)

### Via Render Dashboard (Easiest)

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `wbth-ml-service`
   - **Root Directory**: `apps/ml`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python api.py`
   - **Plan**: Free
5. Add Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `FLASK_PORT`: `8080`
6. Click **"Create Web Service"**
7. Wait 3-5 minutes for deployment
8. **Copy your service URL**: `https://wbth-ml-service.onrender.com`

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

```bash
cd /home/gihan/WBTH

# Link project
vercel link

# Add environment variables
vercel env add DATABASE_URL production
# Paste your Neon connection string

vercel env add ML_SERVICE_URL production
# Paste your Render service URL (from Step 3)

vercel env add NEXTAUTH_SECRET production
# Generate: openssl rand -base64 32

vercel env add NEXTAUTH_URL production
# Enter: https://your-project.vercel.app (you'll update this after first deploy)

# Add email variables (if using email)
vercel env add EMAIL_SERVER_USER production
vercel env add EMAIL_SERVER_PASSWORD production
vercel env add EMAIL_SERVER_HOST production
vercel env add EMAIL_SERVER_PORT production
vercel env add EMAIL_FROM production

# Deploy!
vercel --prod
```

---

## Step 5: Update NEXTAUTH_URL

After first Vercel deployment:

```bash
# Get your actual Vercel URL from the deployment output
# Then update NEXTAUTH_URL:

vercel env rm NEXTAUTH_URL production
vercel env add NEXTAUTH_URL production
# Enter your actual Vercel URL
```

---

## ✅ Verification

### Test ML Service

```bash
curl https://wbth-ml-service.onrender.com/health
# Should return: {"status":"ok"}
```

### Test Frontend

Visit your Vercel URL and:
- ✅ Register a new user
- ✅ Login
- ✅ Test recommendations

---

## 🎉 You're Live!

Your WBTH platform is now deployed:

- **Frontend**: `https://your-project.vercel.app`
- **ML Service**: `https://wbth-ml-service.onrender.com`
- **Database**: Neon PostgreSQL

**Total Cost: $0/month** ✅

---

## 📝 Important Notes

### Cold Starts (Render Free Tier)

- Service spins down after 15 min of inactivity
- First request after spin-down takes ~30 seconds
- Subsequent requests are instant
- **This is normal for free tier!**

### Automatic Deployments

Both Render and Vercel auto-deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Both services deploy automatically! 🚀
```

---

## 🆘 Troubleshooting

### ML Service won't start

**Check logs in Render dashboard:**
1. Go to your service
2. Click "Logs" tab
3. Look for errors

**Common issues:**
- Missing `DATABASE_URL` environment variable
- Wrong `requirements.txt` path
- Database connection failed

### Frontend build fails

**Check Vercel logs:**
1. Go to Vercel dashboard
2. Click on deployment
3. View build logs

**Common issues:**
- Missing environment variables
- TypeScript errors
- Database connection issues

### Database connection fails

**Verify connection string:**
```bash
# Test connection
psql "your-database-url"
```

**Check:**
- Connection string has `?sslmode=require` at the end
- No extra spaces in the string
- Database exists in Neon

---

## 📚 Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure email sending
3. ✅ Set up GitHub Actions for automated testing
4. ✅ Add monitoring and analytics

---

## 💰 Cost Breakdown

| Service | Free Tier | Your Usage | Cost |
|---------|-----------|------------|------|
| Neon | 0.5 GB | ~50 MB | $0 |
| Vercel | 100 GB bandwidth | ~5 GB | $0 |
| Render | 750 hours/month | 720 hours | $0 |
| **Total** | | | **$0/month** |

---

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Dashboard](https://console.neon.tech)
- [Detailed Deployment Guide](DEPLOYMENT.md)
- [Render Deployment Guide](RENDER_DEPLOYMENT.md)

---

**🎊 Congratulations! Your WBTH platform is live!**
