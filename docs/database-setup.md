# Database Setup Guide

## Problem Summary

**Issue**: Database data was being lost after closing IDE and restarting localhost.

**Root Cause**: The PostgreSQL container was not being started with Docker Compose, which meant it was using an anonymous Docker volume instead of the named volume `pgdata`. When the container was stopped/removed, the anonymous volume was deleted, causing data loss.

## Solution

The database is now configured to use a **named Docker volume** (`db_pgdata`) which persists data even when containers are stopped or removed.

---

## Quick Start

### 1. Start the Database

Always use Docker Compose to start the database:

```bash
# Option 1: Use the helper script (recommended)
./scripts/start-db.sh

# Option 2: Manual command
docker compose -f infra/db/docker-compose.postgres.yml up -d
```

> **Note**: Modern Docker uses `docker compose` (with a space), not `docker-compose` (with a hyphen).

### 2. Run Migrations and Seed Data

If starting fresh or after data loss:

```bash
# Option 1: Use the reset script
./scripts/reset-db.sh

# Option 2: Manual commands
cd packages/prisma
npx prisma generate
npx prisma migrate deploy
yarn seed
```

---

## Database Connection Details

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `wbth`
- **Username**: `user`
- **Password**: `password`
- **Connection String**: `postgresql://user:password@localhost:5432/wbth?schema=public`

---

## Important Notes

### ✅ Data Persistence

- Data is now stored in the named volume `db_pgdata`
- This volume persists even when:
  - You stop the container (`docker stop wbth-db`)
  - You remove the container (`docker rm wbth-db`)
  - You restart your computer
  - You close your IDE

### 🔄 When Data is Lost

Data will only be lost if you explicitly delete the Docker volume:

```bash
# ⚠️ WARNING: This will delete all database data!
docker volume rm db_pgdata
```

### 📊 Verify Data Persistence

To verify your data is being persisted:

```bash
# Check which volume the container is using
docker inspect wbth-db --format='{{json .Mounts}}' | python3 -m json.tool

# Expected output should show:
# "Name": "db_pgdata"
# "Source": "/var/lib/docker/volumes/db_pgdata/_data"
```

### 🛠️ Useful Commands

```bash
# Check if database is running
docker ps | grep wbth-db

# View database logs
docker logs wbth-db

# Access PostgreSQL shell
docker exec -it wbth-db psql -U user -d wbth

# Stop the database
docker compose -f infra/db/docker-compose.postgres.yml down

# Stop and remove volume (⚠️ deletes data)
docker compose -f infra/db/docker-compose.postgres.yml down -v

# List all volumes
docker volume ls

# Check database connection
docker exec wbth-db pg_isready -U user -d wbth
```

---

## Troubleshooting

### Problem: "docker-compose: command not found"

**Solution**: Use `docker compose` (space) instead of `docker-compose` (hyphen). Docker Compose V2 is now integrated into Docker.

### Problem: Data still being lost

1. Verify you're starting the database with Docker Compose:
   ```bash
   ./scripts/start-db.sh
   ```

2. Check which volume is being used:
   ```bash
   docker inspect wbth-db --format='{{json .Mounts}}' | python3 -m json.tool
   ```

3. Ensure it shows `"Name": "db_pgdata"` (not a random hash)

### Problem: Cannot connect to database

1. Check if the container is running:
   ```bash
   docker ps | grep wbth-db
   ```

2. Check database health:
   ```bash
   docker exec wbth-db pg_isready -U user -d wbth
   ```

3. Check logs for errors:
   ```bash
   docker logs wbth-db
   ```

---

## Files Modified

1. **`infra/db/docker-compose.postgres.yml`**
   - Added explicit `container_name`
   - Added `restart: unless-stopped`
   - Added health check
   - Made volume configuration explicit

2. **`scripts/start-db.sh`** (new)
   - Helper script to start database correctly
   - Checks if already running
   - Shows connection details

3. **`scripts/reset-db.sh`** (new)
   - Runs Prisma migrations
   - Seeds the database
   - Useful after fresh start

4. **`packages/prisma/package.json`**
   - Changed seed script to use `tsx` instead of `ts-node`
   - Added build script that compiles TypeScript
