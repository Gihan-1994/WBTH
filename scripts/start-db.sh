#!/bin/bash

# Start PostgreSQL database with docker-compose
echo "🚀 Starting PostgreSQL database..."

cd "$(dirname "$0")/.." || exit 1

# Check if database is already running
if docker ps | grep -q wbth-db; then
    echo "✅ Database is already running"
    docker ps --filter "name=wbth-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    # Start the database
    docker compose -f infra/db/docker-compose.postgres.yml up -d
    
    echo "⏳ Waiting for database to be ready..."
    sleep 3
    
    echo "✅ Database started successfully"
    docker ps --filter "name=wbth-db" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
fi

echo ""
echo "📊 Database connection details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: wbth"
echo "   User: user"
echo "   Password: password"
