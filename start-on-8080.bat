@echo off
echo Attempting to stop process on port 8080...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do (
    echo Stopping process %%a...
    taskkill /f /pid %%a
)
echo Starting Vite server on port 8080...
cd /d "%~dp0"
npm run dev
pause
