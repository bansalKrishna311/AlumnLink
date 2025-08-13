@echo off
echo 🚀 Starting AlumnLink Backend with Memory Optimizations
echo =======================================================

REM Kill any existing Node processes on port 5000
echo 🔍 Checking for existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1

REM Create logs directory if it doesn't exist
if not exist logs mkdir logs

REM Clear old logs (older than 7 days)
echo 🧹 Cleaning old logs...
forfiles /p logs /s /m *.log /d -7 /c "cmd /c del @path" >nul 2>&1

REM Start server with memory optimizations
echo 🚀 Starting optimized server...
echo Memory limit: 512MB
echo GC interval: 100ms
echo Garbage collection: Exposed
echo.

REM Set NODE_ENV to development for local
set NODE_ENV=development

REM Start with optimizations
node --max-old-space-size=512 --gc-interval=100 --expose-gc --max-semi-space-size=64 --optimize-for-size server.js

echo ✅ Server started successfully!
pause
