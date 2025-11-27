#!/bin/bash

# ==============================================================================
# Database Management Script for WBTH
#
# Usage: ./scripts/db.sh [start|stop|status]
#
# Commands:
#   start   - Creates and starts the PostgreSQL Docker container if it doesn't
#             exist, or starts it if it is stopped.
#   stop    - Stops the PostgreSQL Docker container.
#   status  - Checks the status of the container.
# ==============================================================================

# --- Configuration ---
# These variables should match your .env file and Prisma connection string.
CONTAINER_NAME="wbth-db"
DB_USER="user"
DB_PASSWORD="password"
DB_NAME="wbth"
DB_PORT="5432"

# --- Helper Functions ---
# Function to print colored output
print_info() {
    echo -e "\033[34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[31m[ERROR]\033[0m $1"
}

# --- Command Functions ---
start_db() {
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker does not seem to be running. Please start Docker and try again."
        exit 1
    fi

    # Check if the container exists
    if [ "$(docker ps -a -q -f name=^/${CONTAINER_NAME}$)" ]; then
        # Container exists, check if it's running
        if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
            print_info "Database container '${CONTAINER_NAME}' is already running."
        else
            # Container is stopped, so start it
            print_info "Starting existing database container '${CONTAINER_NAME}'..."
            docker start "${CONTAINER_NAME}"
            print_success "Container started."
        fi
    else
        # Container does not exist, so create it using Docker Compose
        print_info "Starting database with Docker Compose..."
        
        # Navigate to project root to run docker compose
        cd "$(dirname "$0")/.." || exit 1
        
        docker compose -f infra/db/docker-compose.postgres.yml up -d
        
        print_success "Database container started with Docker Compose."
        print_info "Waiting for PostgreSQL to be ready..."
        sleep 5 # Give the DB a moment to initialize
    fi
}

stop_db() {
    if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
        print_info "Stopping database container '${CONTAINER_NAME}'..."
        docker stop "${CONTAINER_NAME}"
        print_success "Container stopped."
    else
        print_info "Database container '${CONTAINER_NAME}' is not running."
    fi
}

status_db() {
    if [ "$(docker ps -q -f name=^/${CONTAINER_NAME}$)" ]; then
        print_success "Database container '${CONTAINER_NAME}' is running."
        docker ps -f name=^/${CONTAINER_NAME}$
    else
        print_error "Database container '${CONTAINER_NAME}' is not running."
    fi
}

# --- Main Logic ---
COMMAND=$1

if [ -z "$COMMAND" ]; then
    echo "Usage: $0 [start|stop|status]"
    exit 1
fi

case "$COMMAND" in
    start)
        start_db
        ;;
    stop)
        stop_db
        ;;
    status)
        status_db
        ;;
    *)
        print_error "Invalid command: '$COMMAND'"
        echo "Usage: $0 [start|stop|status]"
        exit 1
        ;;
esac
