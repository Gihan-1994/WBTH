# Database Management Guide (Docker & Neon)

This guide explains how to manage your local PostgreSQL database (Docker) and your cloud database (Neon), including how to switch between them and sync data.

## 1. Local Development (Docker)

Your local development uses a PostgreSQL container.

### Start the Local DB
```bash
./scripts/db.sh start
```

### Stop the Local DB
```bash
./scripts/db.sh stop
```

### View Local DB (Prisma Studio)
1. Ensure `apps/web/.env` and `packages/prisma/.env` are set to the local database URL.
2. Run:
```bash
npx prisma studio --schema ./packages/prisma/schema.prisma
```

---

## 2. Cloud Database (Neon)

Neon is used for production-like testing and deployment.

### Connecting to Neon
To use Neon, update your `.env` files with the Neon connection string:
```env
DATABASE_URL="postgresql://neondb_owner:npg_UZl5f3YgHPDn@ep-silent-queen-a1an5o3t.ap-southeast-1.aws.neon.tech/wbth?sslmode=require&channel_binding=require"
```

---

## 3. Switching Between DBs

You must update **BOTH** of these files when switching:
1. `packages/prisma/.env` (Used for migrations and Studio)
2. `apps/web/.env` (Used by the Next.js frontend)

> [!IMPORTANT]
> Always restart your services (`./scripts/start-all.sh`) and regenerate the Prisma client (`npx prisma generate`) after switching.

---

## 4. Syncing Data (Local -> Neon)

If you have local data that you want to move to Neon, use the sync script.

### Using the Sync Script
We've provided a script to automate this:
```bash
chmod +x ./scripts/db-sync.sh
./scripts/db-sync.sh
```

### Manual Sync Steps
If you prefer to do it manually:
1. **Export Local:**
   ```bash
   docker exec wbth-db pg_dump -U user -d wbth -F p -f /tmp/wbth_backup.sql
   docker cp wbth-db:/tmp/wbth_backup.sql /tmp/wbth_backup.sql
   ```
2. **Clear Neon (Optional):**
   ```bash
   psql "NEON_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   ```
3. **Import to Neon:**
   ```bash
   psql "NEON_URL" < /tmp/wbth_backup.sql
   ```
