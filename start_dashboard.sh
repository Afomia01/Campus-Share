#!/bin/bash
# Build the dashboard if it doesn't exist
if [ ! -f "./dashboard" ]; then
    echo "Building dashboard..."
    go build -o dashboard cmd/dashboard/main.go
fi

# Run the dashboard
./dashboard
