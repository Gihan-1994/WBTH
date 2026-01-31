#!/bin/bash

# ==============================================================================
# WBTH Full Stack Startup Script
#
# This script starts all required services for the WBTH application:
# 1. PostgreSQL Database (Docker)
# 2. ML Service (Python API)
# 3. Frontend (Next.js)
#
# Usage: ./scripts/start-all.sh
# ==============================================================================

set -e  # Exit on error

# --- Configuration ---
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DB_CONTAINER_NAME="wbth-db"

# --- Color Output Functions ---
print_header() {
    echo -e "\n\033[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m"
    echo -e "\033[1;36m  $1\033[0m"
    echo -e "\033[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\033[0m\n"
}

print_info() {
    echo -e "\033[34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

print_warning() {
    echo -e "\033[33m[WARNING]\033[0m $1"
}

# --- Cleanup Function ---
cleanup() {
    print_warning "Shutting down services..."
    
    # Kill background processes
    if [ ! -z "$ML_PID" ] && kill -0 "$ML_PID" 2>/dev/null; then
        print_info "Stopping ML service (PID: $ML_PID)..."
        kill "$ML_PID" 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        print_info "Stopping frontend (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    print_info "Database will continue running. Use './scripts/db.sh stop' to stop it."
    exit 0
}

# Set up trap to catch Ctrl+C and other termination signals
trap cleanup SIGINT SIGTERM

# --- Main Script ---
print_header "🚀 WBTH Full Stack Startup"

cd "$PROJECT_ROOT"

# Step 1: Start Database
print_header "📊 Step 1/3: Starting PostgreSQL Database"

if [ -n "$(docker ps -q -f name="^/${DB_CONTAINER_NAME}$")" ]; then
    print_success "Database is already running"
else
    print_info "Starting database..."
    bash "$SCRIPT_DIR/db.sh" start
    
    print_info "Waiting for database to be ready..."
    sleep 3
fi

# Verify database is running
if [ -n "$(docker ps -q -f name="^/${DB_CONTAINER_NAME}$")" ]; then
    print_success "Database is ready"
else
    print_error "Failed to start database"
    exit 1
fi

# Step 2: Start ML Service
print_header "🤖 Step 2/3: Starting ML Service"

print_info "Building Prisma package..."
yarn -C packages/prisma build > /dev/null 2>&1 || {
    print_warning "Prisma build failed, continuing anyway..."
}

print_info "Starting Python ML API..."
cd "$PROJECT_ROOT/apps/ml"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    print_warning "Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Start ML service in background
python api.py > "$PROJECT_ROOT/logs/ml-service.log" 2>&1 &
ML_PID=$!

sleep 2

# Check if ML service started successfully
if kill -0 "$ML_PID" 2>/dev/null; then
    print_success "ML service started (PID: $ML_PID)"
    print_info "ML API running at: http://localhost:5000"
else
    print_error "Failed to start ML service"
    exit 1
fi

# Step 3: Start Frontend
print_header "🌐 Step 3/3: Starting Frontend (Next.js)"

cd "$PROJECT_ROOT"

print_info "Starting Next.js development server..."
cd "$PROJECT_ROOT/apps/web"
yarn dev > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!

sleep 5

# Check if frontend started successfully
if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    print_success "Frontend started (PID: $FRONTEND_PID)"
    print_info "Frontend running at: http://localhost:3000"
else
    print_error "Failed to start frontend"
    cleanup
    exit 1
fi

# All services started
print_header "✅ All Services Running"

echo -e "\033[1;32m"
echo "  📊 Database:  Running (Docker container: $DB_CONTAINER_NAME)"
echo "  🤖 ML API:    http://localhost:5000 (PID: $ML_PID)"
echo "  🌐 Frontend:  http://localhost:3000 (PID: $FRONTEND_PID)"
echo -e "\033[0m"

print_info "Logs are being written to:"
echo "     ML Service: $PROJECT_ROOT/logs/ml-service.log"
echo "     Frontend:   $PROJECT_ROOT/logs/frontend.log"

echo ""
print_warning "Press Ctrl+C to stop ML service and frontend"
print_info "Database will continue running in the background"

# Wait for user interrupt
wait
