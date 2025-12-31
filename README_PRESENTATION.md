

## 📋 Prerequisites

Before you begin, ensure the target PC has:
1.  **Docker Desktop** (Running)
2.  **Go (Golang)** (Optional, but required for the cool "Mission Control" dashboard)
3.  **Git** (To clone the repo)

## 🚀 Quick Setup

1.  **Clone the Repository** (if not already done):
    ```bash
    git clone <your-repo-url>
    cd Campus-Share
    ```

2.  **Run the Setup Wizard**:
    This script will check tools, build Docker images, and compile the dashboard.
    ```bash
    chmod +x setup_presentation.sh
    ./setup_presentation.sh
    ```

## 🎬 Running the Demo

You will need **two terminal windows**.

### Terminal 1: The "Mission Control" (Visuals)
**For Linux/Mac:**
```bash
./run_demo_mode.sh
```

**For Windows:**
Double-click `run_demo_mode.bat`.

*You should see a blank screen waiting for events.*

### Terminal 2: The "Action" (Trigger)
Run the demo script to simulate a user uploading a file.
```bash
./demo_script.sh
```

## 🕵️ What to Explain
As the script runs, explain the flow shown on the dashboard:
1.  **Blue Box**: User uploads a file -> Core API saves it -> Publishes event to Redis.
2.  **Yellow Box**: Notification Service hears the event -> Sends emails to followers.
3.  **Green Box**: Analytics Service hears the event -> Updates real-time stats.
4.  **Red/Rich Text**: AI Service hears the event -> Generates a study guide using Google Gemini.

## 🧹 Cleanup
To stop everything and clean up:
```bash
docker-compose down
```
