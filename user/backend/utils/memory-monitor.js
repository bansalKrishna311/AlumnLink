#!/usr/bin/env node

// memory-monitor.js - Memory usage monitoring and alerts
import fs from 'fs';
import path from 'path';

class MemoryMonitor {
  constructor() {
    this.alerts = [];
    this.logFile = path.join(process.cwd(), 'logs', 'memory.log');
    this.maxMemoryMB = 400; // 400MB threshold
    this.checkInterval = 30000; // 30 seconds
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    console.log('🔍 Starting memory monitor...');
    this.isRunning = true;
    
    // Initial check
    this.checkMemory();
    
    // Set up interval monitoring
    this.intervalId = setInterval(() => {
      this.checkMemory();
    }, this.checkInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('🛑 Memory monitor stopped');
  }

  checkMemory() {
    const memUsage = process.memoryUsage();
    const rssMB = Math.round(memUsage.rss / 1024 / 1024);
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    const externalMB = Math.round(memUsage.external / 1024 / 1024);

    const timestamp = new Date().toISOString();
    
    const memoryInfo = {
      timestamp,
      rss: rssMB,
      heapUsed: heapUsedMB,
      heapTotal: heapTotalMB,
      external: externalMB,
      uptime: Math.round(process.uptime())
    };

    // Log to file
    this.logMemoryUsage(memoryInfo);

    // Check for high memory usage
    if (rssMB > this.maxMemoryMB) {
      this.handleHighMemoryUsage(memoryInfo);
    }

    // Force garbage collection if available and memory is high
    if (global.gc && heapUsedMB > 200) {
      global.gc();
      console.log(`🗑️ Forced garbage collection - Heap was ${heapUsedMB}MB`);
    }

    // Log memory stats periodically
    if (Math.floor(Date.now() / 60000) % 5 === 0) { // Every 5 minutes
      console.log(`📊 Memory: RSS=${rssMB}MB, Heap=${heapUsedMB}/${heapTotalMB}MB, External=${externalMB}MB`);
    }
  }

  handleHighMemoryUsage(memoryInfo) {
    const alert = {
      timestamp: memoryInfo.timestamp,
      type: 'HIGH_MEMORY',
      rss: memoryInfo.rss,
      threshold: this.maxMemoryMB
    };

    this.alerts.push(alert);

    // Keep only last 10 alerts
    if (this.alerts.length > 10) {
      this.alerts.shift();
    }

    console.warn(`⚠️ HIGH MEMORY USAGE: ${memoryInfo.rss}MB (threshold: ${this.maxMemoryMB}MB)`);
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
      console.log('🗑️ Forced garbage collection due to high memory usage');
    }

    // Log detailed memory info
    console.log('Memory breakdown:', memoryInfo);
  }

  logMemoryUsage(memoryInfo) {
    const logEntry = `${memoryInfo.timestamp} - RSS: ${memoryInfo.rss}MB, Heap: ${memoryInfo.heapUsed}/${memoryInfo.heapTotal}MB, External: ${memoryInfo.external}MB, Uptime: ${memoryInfo.uptime}s\n`;
    
    try {
      // Ensure logs directory exists
      const logsDir = path.dirname(this.logFile);
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }

      fs.appendFileSync(this.logFile, logEntry);
    } catch (error) {
      console.error('Failed to write memory log:', error);
    }
  }

  getStats() {
    const memUsage = process.memoryUsage();
    
    return {
      current: {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
      },
      alerts: this.alerts,
      uptime: Math.round(process.uptime()),
      isRunning: this.isRunning
    };
  }

  // Clean old log files
  cleanOldLogs() {
    try {
      const logsDir = path.dirname(this.logFile);
      const files = fs.readdirSync(logsDir);
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

      files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.birthtime.getTime() < oneWeekAgo) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Cleaned old log file: ${file}`);
        }
      });
    } catch (error) {
      console.error('Error cleaning old logs:', error);
    }
  }
}

// Create and export singleton instance
const memoryMonitor = new MemoryMonitor();

// Handle process termination
process.on('SIGTERM', () => memoryMonitor.stop());
process.on('SIGINT', () => memoryMonitor.stop());

export default memoryMonitor;
