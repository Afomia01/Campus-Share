#!/bin/sh
set -e

# Run migrations
echo "Running database migrations..."
./main -migrate

# Start the server
echo "Starting server..."
./main
