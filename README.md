# WBTH - Welcome Back To Home

A comprehensive tourism platform for Sri Lanka connecting tourists with guides and accommodations. Built with Next.js, Flask, and PostgreSQL.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-green)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### For Tourists
- 🔍 Browse and search guides and accommodations
- 🤖 AI-powered personalized recommendations
- 📅 Book guides and accommodations
- 💳 Secure payments via Stripe
- ⭐ Rate and review services
- 🔔 Real-time notifications

### For Guides & Accommodation Providers
- 📊 Comprehensive dashboard with analytics
- 💰 Revenue tracking and management
- 📆 Availability and booking management
- 📈 Performance metrics and ratings
- 💬 Customer communication

### For Admins
- 👥 User management across all roles
- 📅 Event creation and management
- 📊 Platform-wide analytics
- 🔧 System configuration

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication
- **Stripe** - Payment processing
- **Chart.js** - Data visualization

### Backend
- **Flask 3.0** - Python web framework
- **scikit-learn** - Machine learning
- **pandas** - Data processing
- **Prisma 7** - Database ORM
- **PostgreSQL 16** - Database

### Infrastructure
- **Vercel** - Frontend hosting
- **Render** - ML service hosting
- **Neon** - Serverless PostgreSQL
- **Docker** - Local development

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** and **Yarn**
  ```bash
  node --version  # Should be 20 or higher
  yarn --version
  ```

- **Python 3.11+** and **pip**
  ```bash
  python3 --version  # Should be 3.11 or higher
  pip3 --version
  ```

- **Docker** and **Docker Compose**
  ```bash
  docker --version
  docker compose version
  ```

- **Git**
  ```bash
  git --version
  ```

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/WBTH.git
cd WBTH
```

#### 2. Install Dependencies

```bash
# Install Node.js dependencies
yarn install

# Install Python dependencies for ML service
cd apps/ml
pip3 install -r requirements.txt
cd ../..
```

#### 3. Set Up Environment Variables

**Step 1: Copy the `.env.example` files to `.env`**

```bash
# Copy .env.example files and rename them to .env
cp packages/.env.example packages/prisma/.env
cp apps/web/.env.example apps/web/.env
cp apps/ml/.env.example apps/ml/.env
```

**Step 2: Edit the `.env` files with your actual values**

Open each `.env` file and replace the placeholder values:

**`packages/prisma/.env`**
- Replace `your_password_here` with your chosen database password

**`apps/web/.env`**
- Replace `your_password_here` with the same database password
- Generate secrets: `openssl rand -base64 32` (run twice for JWT_SECRET and NEXTAUTH_SECRET)
- Get Resend API key from https://resend.com (free tier available)
- Get Stripe keys from https://stripe.com (test mode is free)

**`apps/ml/.env`**
- Replace `your_password_here` with the same database password

> **Important**: 
> - 📝 The `.env.example` files are templates with placeholder values
> - ✏️ You MUST copy them to `.env` and fill in your own values
> - ✅ `.env.example` files are safe to commit to GitHub (placeholders only)
> - ❌ `.env` files should NEVER be committed (contain real secrets)
> - 🔒 Your `.gitignore` already protects `.env` files from being committed

#### 4. Configure Database Password

Update the PostgreSQL password in `infra/db/docker-compose.postgres.yml`:

```yaml
environment:
  POSTGRES_PASSWORD: your_password  # Use the same password from step 3
  POSTGRES_USER: user
  POSTGRES_DB: wbth
```

#### 5. Start the Database

```bash
# Start PostgreSQL with Docker
./scripts/start-db.sh
```

Wait for the message: `✅ Database is ready`

#### 6. Generate Prisma Client and Run Migrations

```bash
cd packages/prisma

# Generate Prisma client (REQUIRED - creates type-safe database client)
npx prisma generate

# Run migrations (creates database tables)
npx prisma migrate deploy

# Seed the database with sample data
yarn seed

cd ../..
```

> **Important**: `npx prisma generate` must be run before starting the application. This generates the Prisma Client that your app uses to interact with the database. You'll need to run this again whenever you modify `schema.prisma`.

#### 7. Start All Services

```bash
# Start database, ML service, and frontend
./scripts/start-all.sh
```

This will start:
- 📊 **Database**: PostgreSQL on port 5432
- 🤖 **ML Service**: Flask API on http://localhost:5000
- 🌐 **Frontend**: Next.js on http://localhost:3000

> **What Gets Built:**
> - **Prisma Client** (Step 6): ✅ **REQUIRED** - Must run `npx prisma generate` before first use and after schema changes
> - **Next.js Frontend**: ❌ **NOT required for development** - Runs in dev mode with hot reloading
> - **ML Service**: ❌ **NOT required** - Python runs directly, no build step needed
> 
> **When to Build:**
> - **Development**: Only Prisma client generation is needed
> - **Production**: Run `yarn build` from project root (builds Prisma + Next.js automatically)

### 🎉 Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **ML API**: http://localhost:5000
- **Prisma Studio** (Database GUI): Run `npx prisma studio` in `packages/prisma/`

### Default Login Credentials

After seeding, you can log in with:

**Admin:**
- Email: `admin@wbth.com`
- Password: Check `packages/prisma/seed/users.ts`

**Tourist:**
- Email: `tourist@example.com`
- Password: Check `packages/prisma/seed/users.ts`

## 📁 Project Structure

```
WBTH/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── app/               # Next.js App Router
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility functions
│   │   └── README.md          # Web app documentation
│   └── ml/                     # Flask ML service
│       ├── app.py             # Flask application
│       ├── models/            # ML models
│       └── requirements.txt   # Python dependencies
├── packages/
│   └── prisma/                # Shared Prisma package
│       ├── schema.prisma      # Database schema
│       ├── migrations/        # Database migrations
│       ├── seed/              # Seed data scripts
│       └── README.md          # Prisma documentation
├── infra/
│   └── db/                    # Database infrastructure
│       └── docker-compose.postgres.yml
├── scripts/                   # Utility scripts
│   ├── start-all.sh          # Start all services
│   ├── start-db.sh           # Start database only
│   └── reset-db.sh           # Reset database
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── ...
└── README.md                  # This file
```

For detailed documentation on each component:
- [Web Application](apps/web/README.md)
- [Prisma Package](packages/prisma/README.md)
- [Architecture](docs/ARCHITECTURE.md)

## 💻 Development

### Running Individual Services

**Database Only:**
```bash
./scripts/start-db.sh
```

**Frontend Only:**
```bash
cd apps/web
yarn dev
```

**ML Service Only:**
```bash
cd apps/ml
python3 app.py
```

### Common Development Tasks

**View Database:**
```bash
cd packages/prisma
npx prisma studio
```

**Create a Migration:**
```bash
cd packages/prisma
npx prisma migrate dev --name your_migration_name
```

**Reset Database:**
```bash
./scripts/reset-db.sh
```

**Run Linting:**
```bash
cd apps/web
yarn lint
```

**Build for Production:**
```bash
# Navigate to the web app directory
cd apps/web

# Build the frontend (only needed for production deployment)
yarn build

# Test the production build locally
yarn start

# When done testing, stop with Ctrl+C and return to root
cd ../..
```

> **Important**: The `build` and `start` commands must be run from the `apps/web` directory, not from the project root.

> **Development vs Production:**
> - **Development** (`yarn dev` in `apps/web`): No build needed, hot reloading, detailed error messages
> - **Production** (`yarn build` then `yarn start` in `apps/web`): Optimized build, faster performance, required for deployment

### Changing Database Password

If you need to change the PostgreSQL password:

```bash
# 1. Update password in the running database
docker exec wbth-db psql -U user -d wbth -c 'ALTER USER "user" WITH PASSWORD '\''new_password'\'';'

# 2. Update all .env files
# - packages/prisma/.env
# - apps/web/.env
# - apps/ml/.env

# 3. Update infra/db/docker-compose.postgres.yml

# 4. Restart applications (not the database)
./scripts/start-all.sh
```

## 🚀 Deployment

### Production Architecture

- **Frontend**: Deployed on Vercel
- **ML Service**: Deployed on Render
- **Database**: Hosted on Neon (Serverless PostgreSQL)

### Quick Deploy

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

**ML Service (Render):**
- Connect your GitHub repository to Render
- Render will auto-deploy on push to main branch
- See [Render Deployment Guide](docs/RENDER_DEPLOYMENT.md)

**Database (Neon):**
- Create a Neon database at https://neon.tech
- Update `DATABASE_URL` in production environment variables
- Run migrations: `npx prisma migrate deploy`

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 📚 Documentation

### Getting Started
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and infrastructure
- [Account Setup](docs/ACCOUNT_SETUP.md) - Set up required accounts (Vercel, Render, Neon, Stripe)
- [Quick Start with Render](docs/QUICK_START_RENDER.md) - Deploy in 30 minutes

### Deployment
- [Deployment Guide](docs/DEPLOYMENT.md) - Complete deployment instructions
- [Render Deployment](docs/RENDER_DEPLOYMENT.md) - Detailed Render setup
- [Deployment Comparison](docs/DEPLOYMENT_COMPARISON.md) - Compare deployment options
- [Quick Reference](docs/DEPLOYMENT_QUICK_REFERENCE.md) - Commands and checklists

### Component Documentation
- [Web Application](apps/web/README.md) - Frontend documentation
- [Prisma Package](packages/prisma/README.md) - Database schema and usage

## 🐛 Troubleshooting

### Database Connection Issues

**Error: "password authentication failed"**
```bash
# Check if database is running
docker ps | grep wbth-db

# Verify password in .env matches docker-compose.yml
# Update password in database if needed (see "Changing Database Password" above)
```

**Error: "database does not exist"**
```bash
# Run migrations
cd packages/prisma
npx prisma migrate deploy
```

### Prisma Client Issues

**Error: "Cannot find module '@prisma/client'"**
```bash
cd packages/prisma
npx prisma generate
```

### Frontend Build Errors

**Error: TypeScript errors during build**
```bash
# The project currently ignores TypeScript errors for deployment
# Check next.config.js - typescript.ignoreBuildErrors is set to true
```

### Port Already in Use

**Error: "Port 3000/5000/5432 already in use"**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9  # For port 3000
lsof -ti:5000 | xargs kill -9  # For port 5000
lsof -ti:5432 | xargs kill -9  # For port 5432
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- ML powered by [scikit-learn](https://scikit-learn.org/)
- Database by [Prisma](https://www.prisma.io/) and [PostgreSQL](https://www.postgresql.org/)
- Deployed on [Vercel](https://vercel.com/), [Render](https://render.com/), and [Neon](https://neon.tech/)

---

**Made with ❤️ for Sri Lankan Tourism**

For questions or support, please open an issue on GitHub.
