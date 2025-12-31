#!/bin/bash
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Campus-Share Environment...${NC}"
docker-compose up -d

echo -e "${GREEN}Services are running!${NC}"
echo -e "API: http://localhost:8080"
echo -e ""

if [ -f "./dashboard" ]; then
    echo -e "${BLUE}Launching Mission Control Dashboard...${NC}"
    echo -e "Press Ctrl+C to exit the dashboard (services will keep running)."
    ./dashboard
else
    echo -e "Dashboard binary not found. You can view logs with: docker-compose logs -f"
fi
