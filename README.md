# WBTH Project

A comprehensive tourism platform for Sri Lanka connecting tourists with guides and accommodations.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
yarn install

# Start all services
./scripts/start-all.sh
```

### Deployment

**Automated (Recommended):**
- Push to `main` branch → Automatic deployment via GitHub Actions
- See [GitHub Actions Setup](docs/GITHUB_ACTIONS_SETUP.md)

**Manual:**
- **ML Service**: Deploy to Render.com (see [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md))
- **Frontend**: Deploy to Vercel
  ```bash
  vercel --prod
  ```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## 📁 Project Structure

```
wbth/
├── apps/
│   ├── web/          # Next.js frontend
│   └── ml/           # Flask ML service
├── packages/
│   ├── prisma/       # Database schema
│   ├── ui/           # Shared UI components
│   └── lib/          # Shared utilities
├── scripts/          # Deployment and utility scripts
└── docs/             # Documentation
```

## 🏗️ Architecture

- **Frontend**: Next.js 15 on Vercel
- **ML Service**: Flask on Google Cloud Run
- **Database**: Managed PostgreSQL (Neon/Supabase/Cloud SQL)

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture.

## 📚 Documentation

- **[Quick Start with Render](docs/QUICK_START_RENDER.md) - 🚀 Deploy in 30 minutes (no credit card!)**
- **[Account Setup](docs/ACCOUNT_SETUP.md) - ⭐ START HERE if you haven't set up accounts yet**
- [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md) - Detailed Render deployment instructions
- [Deployment Guide](docs/DEPLOYMENT.md) - Complete deployment instructions
- [GitHub Actions Setup](docs/GITHUB_ACTIONS_SETUP.md) - Automated CI/CD setup
- [Deployment Comparison](docs/DEPLOYMENT_COMPARISON.md) - GitHub Actions vs Manual
- [Quick Reference](docs/DEPLOYMENT_QUICK_REFERENCE.md) - Quick commands and checklists
- [Architecture](docs/ARCHITECTURE.md) - System architecture and design

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth.js

### Backend
- Flask
- scikit-learn
- PostgreSQL
- Prisma ORM

### Infrastructure
- Vercel (Frontend)
- Google Cloud Run (ML Service)
- Managed PostgreSQL (Database)

## 📝 License

See LICENSE file for details.
