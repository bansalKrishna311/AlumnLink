#!/bin/bash

# AlumnLink Backend Optimizer - Development Startup Script

echo "🚀 Starting AlumnLink Backend with Memory Optimizations"
echo "======================================================="

# Kill any existing Node processes on port 5000
echo "🔍 Checking for existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Create logs directory if it doesn't exist
mkdir -p logs

# Clear old logs
echo "🧹 Cleaning old logs..."
find logs -name "*.log" -mtime +7 -delete 2>/dev/null || true

# Start server with memory optimizations
echo "🚀 Starting optimized server..."
echo "Memory limit: 512MB"
echo "GC interval: 100ms"
echo "Garbage collection: Exposed"
echo ""

# Set NODE_ENV to development for local
export NODE_ENV=development

# Start with optimizations
node \
  --max-old-space-size=512 \
  --gc-interval=100 \
  --expose-gc \
  --max-semi-space-size=64 \
  --optimize-for-size \
  server.js

echo "✅ Server started successfully!"
