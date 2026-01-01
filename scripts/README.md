# WBTH Scripts Directory

This directory contains utility scripts for managing the WBTH application.

## Available Scripts

### 🚀 Main Startup Scripts

#### `start-all.sh`
**Start all services (Database + ML + Frontend)**
```bash
./scripts/start-all.sh
```
This script will:
1. Start the PostgreSQL database (Docker)
2. Start the ML service (Python API on port 5000)
3. Start the frontend (Next.js on port 3000)
4. Keep all services running until you press Ctrl+C

**Features:**
- Automatic dependency checks
- Colored output for better readability
- Process management with PIDs
- Graceful shutdown on Ctrl+C
- Logs written to `logs/` directory

**Note:** The database will continue running after you stop the script. Use `./scripts/db.sh stop` to stop it.

---

### 📊 Database Management

#### `db.sh`
**Comprehensive database management**
```bash
./scripts/db.sh [start|stop|status]
```
- `start` - Creates and starts PostgreSQL container
- `stop` - Stops the database container
- `status` - Shows current database status

#### `start-db.sh`
**Quick database startup**
```bash
./scripts/start-db.sh
```
Simple script to start the database with connection details.

#### `reset-db.sh`
**Reset database**
```bash
./scripts/reset-db.sh
```
Drops and recreates the database schema.

#### `migrate.sh`
**Run database migrations**
```bash
./scripts/migrate.sh
```
Applies Prisma migrations to the database.

#### `seed.sh`
**Seed database with test data**
```bash
./scripts/seed.sh
```
Populates the database with initial/test data.

---

### 🛠️ Development Scripts

#### `dev.sh`
**Start development servers**
```bash
./scripts/dev.sh
```
Starts both the frontend and ML service (without database management).

---

### ✅ Quality Assurance

#### `lint.sh`
**Run linting**
```bash
./scripts/lint.sh
```
Checks code quality and style.

#### `typecheck.sh`
**Run TypeScript type checking**
```bash
./scripts/typecheck.sh
```
Validates TypeScript types across the project.

---

## Quick Start Guide

### First Time Setup
```bash
# 1. Start the database
./scripts/db.sh start

# 2. Run migrations
./scripts/migrate.sh

# 3. Seed the database (optional)
./scripts/seed.sh

# 4. Start all services
./scripts/start-all.sh
```

### Daily Development
```bash
# Start everything
./scripts/start-all.sh

# When done, press Ctrl+C to stop ML and frontend
# Database keeps running for next session
```

### Stop Everything
```bash
# Stop database
./scripts/db.sh stop
```

---

## Logs

When using `start-all.sh`, logs are written to:
- **ML Service:** `logs/ml-service.log`
- **Frontend:** `logs/frontend.log`

View logs in real-time:
```bash
# ML Service
tail -f logs/ml-service.log

# Frontend
tail -f logs/frontend.log
```

---

## Troubleshooting

### Database won't start
```bash
# Check Docker is running
docker info

# Check if port 5432 is in use
lsof -i :5432

# Force remove old container
docker rm -f wbth-db
./scripts/db.sh start
```

### ML Service fails
```bash
# Check Python virtual environment
cd apps/ml
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend fails
```bash
# Clear Next.js cache
rm -rf apps/web/.next
yarn -C apps/web dev
```

---

## Environment Requirements

- **Docker** - For PostgreSQL database
- **Node.js** - For frontend (Next.js)
- **Python 3.x** - For ML service
- **Yarn** - Package manager

---

## Notes

- All scripts should be run from the project root directory
- Database data persists in Docker volumes
- Use `./scripts/reset-db.sh` to clear all data
- Scripts use colored output for better visibility
