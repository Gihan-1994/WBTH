# GitHub Actions CI/CD Setup Guide

This guide will help you set up automated deployments using GitHub Actions.

## Overview

We have three GitHub Actions workflows:

1. **`deploy-ml.yml`** - Deploys ML service to Google Cloud Run (triggers on changes to `apps/ml/`)
2. **`deploy-frontend.yml`** - Deploys frontend to Vercel (triggers on changes to `apps/web/` or `packages/`)
3. **`test.yml`** - Runs tests on pull requests and pushes to main

## Prerequisites

- GitHub repository with your code
- Google Cloud Platform account with billing enabled
- Vercel account
- Production database set up

## Step 1: Create Google Cloud Service Account

### 1.1 Create Service Account

```bash
# Set your project ID
export GCP_PROJECT_ID="your-gcp-project-id"

# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions" \
  --project=$GCP_PROJECT_ID

# Get the service account email
export SA_EMAIL="github-actions@${GCP_PROJECT_ID}.iam.gserviceaccount.com"
```

### 1.2 Grant Required Permissions

```bash
# Grant Cloud Run Admin role
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Grant Storage Admin role (for Container Registry)
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin"

# Grant Service Account User role
gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"
```

### 1.3 Create and Download Key

```bash
# Create key file
gcloud iam service-accounts keys create github-actions-key.json \
  --iam-account=$SA_EMAIL

# The key is now in github-actions-key.json
# IMPORTANT: Keep this file secure and never commit it to Git!
```

## Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

### Required Secrets

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `GCP_PROJECT_ID` | Your Google Cloud project ID | From GCP Console |
| `GCP_SA_KEY` | Service account JSON key | Contents of `github-actions-key.json` |
| `DATABASE_URL` | Production database URL | From your database provider |
| `VERCEL_TOKEN` | Vercel authentication token | See below |

### Getting Vercel Token

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Create token
vercel tokens create github-actions
```

Copy the token and add it as `VERCEL_TOKEN` in GitHub secrets.

## Step 3: Configure Vercel Project

### 3.1 Link Project to Vercel

```bash
# In your project root
vercel link
```

Follow the prompts to link your project.

### 3.2 Set Environment Variables in Vercel

```bash
# Add all required environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
vercel env add ML_SERVICE_URL production
vercel env add EMAIL_SERVER_USER production
vercel env add EMAIL_SERVER_PASSWORD production
vercel env add EMAIL_SERVER_HOST production
vercel env add EMAIL_SERVER_PORT production
vercel env add EMAIL_FROM production
```

## Step 4: Enable GitHub Actions

### 4.1 Push Workflow Files

The workflow files are already in `.github/workflows/`. Just commit and push:

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### 4.2 Verify Workflows

1. Go to your GitHub repository
2. Click on "Actions" tab
3. You should see the workflows listed

## Step 5: Test Automated Deployment

### Test ML Service Deployment

```bash
# Make a change to ML service
echo "# Test change" >> apps/ml/README.md

# Commit and push
git add apps/ml/README.md
git commit -m "Test ML deployment"
git push origin main
```

Watch the deployment in GitHub Actions tab.

### Test Frontend Deployment

```bash
# Make a change to frontend
echo "# Test change" >> apps/web/README.md

# Commit and push
git add apps/web/README.md
git commit -m "Test frontend deployment"
git push origin main
```

## How It Works

### Automatic Deployments

- **Push to `main` branch** → Triggers deployment
- **Changes in `apps/ml/`** → Deploys ML service only
- **Changes in `apps/web/` or `packages/`** → Deploys frontend only
- **Pull requests** → Runs tests only (no deployment)

### Manual Deployments

You can also trigger deployments manually:

1. Go to GitHub → Actions
2. Select the workflow (e.g., "Deploy ML Service to Cloud Run")
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Monitoring Deployments

### View Deployment Status

1. Go to GitHub → Actions
2. Click on the running workflow
3. View logs in real-time

### Deployment Summary

After each deployment, GitHub Actions creates a summary with:
- Deployment URL
- Commit SHA
- Service details

## Troubleshooting

### Issue: "Permission denied" errors

**Solution**: Verify service account has correct permissions

```bash
# Check current permissions
gcloud projects get-iam-policy $GCP_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:${SA_EMAIL}"
```

### Issue: Vercel deployment fails

**Solution**: 
1. Verify `VERCEL_TOKEN` is correct
2. Check environment variables are set in Vercel
3. Ensure project is linked: `vercel link`

### Issue: Docker build fails

**Solution**:
1. Test Docker build locally first
2. Check Dockerfile syntax
3. Verify all dependencies are in `requirements.txt`

### Issue: Database connection fails

**Solution**:
1. Verify `DATABASE_URL` secret is correct
2. Check database allows connections from GitHub Actions IPs
3. For Cloud SQL: Enable Cloud SQL Admin API

## Security Best Practices

### Protect Secrets

- ✅ Never commit secrets to Git
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate service account keys regularly
- ✅ Use least privilege principle for permissions

### Service Account Security

```bash
# List all keys for service account
gcloud iam service-accounts keys list \
  --iam-account=$SA_EMAIL

# Delete old keys
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=$SA_EMAIL
```

### Delete the Local Key File

After adding to GitHub Secrets:

```bash
# Securely delete the key file
shred -u github-actions-key.json
```

## Cost Considerations

### GitHub Actions

- **Free tier**: 2,000 minutes/month for private repos
- **Public repos**: Unlimited minutes
- Typical deployment: 3-5 minutes

### Estimated Monthly Usage

- ML deployments: ~10 deployments × 5 min = 50 minutes
- Frontend deployments: ~20 deployments × 3 min = 60 minutes
- Tests: ~50 runs × 2 min = 100 minutes
- **Total**: ~210 minutes/month (well within free tier)

## Rollback Strategy

### Rollback ML Service

```bash
# List recent revisions
gcloud run revisions list --service=wbth-ml-service --region=us-central1

# Rollback to specific revision
gcloud run services update-traffic wbth-ml-service \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```

### Rollback Frontend

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "Promote to Production"

Or via Git:

```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

## Advanced Configuration

### Deploy to Staging First

Create a staging workflow that deploys to a staging environment before production:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches:
      - develop
```

### Add Slack Notifications

Add Slack notifications for deployment status:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Run Database Migrations

Add migration step before deployment:

```yaml
- name: Run Migrations
  run: |
    cd packages/prisma
    npx prisma migrate deploy
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Comparison: GitHub Actions vs Manual

| Feature | GitHub Actions | Manual Scripts |
|---------|---------------|----------------|
| **Automation** | ✅ Automatic | ❌ Manual |
| **Consistency** | ✅ Always same | ⚠️ Human error |
| **Team Access** | ✅ Anyone with repo access | ❌ Only you |
| **Setup Time** | ⚠️ 30 minutes | ✅ 5 minutes |
| **Debugging** | ⚠️ Check logs in GitHub | ✅ See errors locally |
| **Cost** | ✅ Free (within limits) | ✅ Free |

## Next Steps

1. ✅ Set up GitHub secrets
2. ✅ Test automated deployments
3. ✅ Configure Slack notifications (optional)
4. ✅ Set up staging environment (optional)
5. ✅ Document your deployment process for team

## Support

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google Cloud Run CI/CD](https://cloud.google.com/run/docs/continuous-deployment)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)
