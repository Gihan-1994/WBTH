#!/bin/bash

# Database Sync Script (Local Docker -> Neon)
# This script dumps your local postgres container data and imports it into Neon.

# --- Configuration ---
LOCAL_CONTAINER="wbth-db"
LOCAL_USER="user"
LOCAL_DB="wbth"
BACKUP_PATH="/tmp/wbth_sync_backup.sql"

# Neon Connection String
NEON_URL="postgresql://neondb_owner:npg_UZl5f3YgHPDn@ep-silent-queen-a1an5o3t.ap-southeast-1.aws.neon.tech/wbth?sslmode=require&channel_binding=require"

echo "🚀 Starting Database Sync: Local -> Neon"

# 1. Export local DB
echo "📦 Dumping local database from container..."
docker exec $LOCAL_CONTAINER pg_dump -U $LOCAL_USER -d $LOCAL_DB -F p -f /tmp/backup.sql
docker cp $LOCAL_CONTAINER:/tmp/backup.sql $BACKUP_PATH

# 2. Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Please install postgresql-client."
    exit 1
fi

# 3. Import to Neon
echo "☁️ Importing data to Neon..."
echo "⚠️  This will overwrite existing data in Neon. Continue? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🔥 Clearing Neon schema..."
    psql "$NEON_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
    
    echo "📥 Restoring data..."
    psql "$NEON_URL" < $BACKUP_PATH
    echo "✅ Sync Completed successfully!"
else
    echo "❌ Sync cancelled by user."
fi

# Cleanup
rm $BACKUP_PATH
