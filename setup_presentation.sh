#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=============================================================${NC}"
echo -e "${BLUE}       Campus-Share Presentation Setup Wizard               ${NC}"
echo -e "${BLUE}=============================================================${NC}"

# 1. Check Prerequisites
echo -e "\n${GREEN}[1/4] Checking Prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed! Please install Docker Desktop.${NC}"
    exit 1
fi
echo -e "✅ Docker is installed."

if ! command -v go &> /dev/null; then
    echo -e "${RED}⚠️  Go is not installed.${NC}"
    echo -e "   The 'Mission Control' dashboard requires Go."
    echo -e "   You can still run the app, but the visualization won't work."
    HAS_GO=false
else
    echo -e "✅ Go is installed."
    HAS_GO=true
fi

# 2. Build Docker Services
echo -e "\n${GREEN}[2/4] Building Microservices (this may take a minute)...${NC}"
docker-compose build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Docker build failed.${NC}"
    exit 1
fi
echo -e "✅ Docker images built successfully."

# 3. Build Dashboard Tool
echo -e "\n${GREEN}[3/4] Setting up Mission Control Dashboard...${NC}"
if [ "$HAS_GO" = true ]; then
    # Build for Linux (Current Machine)
    echo "   Building for Linux..."
    go build -o dashboard cmd/dashboard/main.go
    
    # Build for Windows (Friend's Machine)
    echo "   Building for Windows (dashboard.exe)..."
    GOOS=windows GOARCH=amd64 go build -o dashboard.exe cmd/dashboard/main.go
    
    if [ $? -eq 0 ]; then
        echo -e "✅ Dashboard compiled successfully (Linux & Windows)."
    else
        echo -e "${RED}❌ Dashboard compilation failed.${NC}"
    fi
else
    echo -e "⚠️  Skipping dashboard build (Go missing)."
fi

# 4. Create Helper Scripts
echo -e "\n${GREEN}[4/4] Finalizing Setup...${NC}"

# Create a simple run script for the friend
cat > run_demo_mode.sh << 'EOF'
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
EOF

chmod +x run_demo_mode.sh

echo -e "${BLUE}=============================================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${BLUE}=============================================================${NC}"
echo -e "To start the presentation on this PC:"
echo -e "1. Run: ${GREEN}./run_demo_mode.sh${NC}"
echo -e "2. In a separate terminal, run: ${GREEN}./demo_script.sh${NC} to trigger events."
echo -e ""
