@echo off
SETLOCAL EnableDelayedExpansion

echo =============================================================
echo        Campus-Share Presentation Launcher (Windows)
echo =============================================================

echo.
echo [1/2] Starting Docker Services...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to start Docker services. 
    echo Please make sure Docker Desktop is running.
    pause
    exit /b 1
)

echo.
echo [2/2] Services are UP!
echo API is available at: http://localhost:8080
echo.

if exist dashboard.exe (
    echo Launching Mission Control Dashboard...
    echo Press Ctrl+C to stop the dashboard.
    dashboard.exe
) else (
    echo [WARNING] 'dashboard.exe' not found.
    echo Falling back to standard Docker logs...
    echo.
    docker-compose logs -f
)

pause
