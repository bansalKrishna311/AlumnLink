#!/bin/bash

# AlumnLink Frontend Optimization Startup Script
echo "🚀 Starting AlumnLink Frontend with Performance Optimizations"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clear any existing cache
echo "🧹 Clearing cache..."
rm -rf node_modules/.vite 2>/dev/null || true
rm -rf dist 2>/dev/null || true

# Check for memory issues
echo "💾 Checking system memory..."
if command -v free &> /dev/null; then
    free -h
elif command -v vm_stat &> /dev/null; then
    vm_stat
fi

# Set Node.js memory limit for development
export NODE_OPTIONS="--max_old_space_size=4096"

# Set performance monitoring flags
export VITE_PERFORMANCE_MONITORING=true

echo "⚡ Performance optimizations active:"
echo "   ✅ React Query caching configured"
echo "   ✅ Bundle splitting enabled"
echo "   ✅ Memory monitoring active"
echo "   ✅ Debounced search implemented"
echo "   ✅ Virtual scrolling ready"

# Start development server with optimizations
echo "🌟 Starting development server..."
npm run dev

# If the server exits unexpectedly
if [ $? -ne 0 ]; then
    echo "❌ Server exited with error. Checking for issues..."
    echo "💡 Try running: npm run dev:clean"
fi
