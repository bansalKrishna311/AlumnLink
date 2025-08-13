// cache-cleanup.js - Cache and Memory Cleanup Service
import memoryMonitor from './memory-monitor.js';

class CacheCleanupService {
  constructor() {
    this.cleanupInterval = null;
    this.isRunning = false;
    this.caches = new Map(); // Registry of caches to clean
  }

  // Register a cache for cleanup
  registerCache(name, cacheMap, maxSize = 100, ttl = 5 * 60 * 1000) {
    this.caches.set(name, {
      cache: cacheMap,
      maxSize,
      ttl,
      lastCleanup: Date.now()
    });
  }

  // Start the cleanup service
  start() {
    if (this.isRunning) return;
    
    console.log('🧹 Starting cache cleanup service...');
    this.isRunning = true;
    
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 5 * 60 * 1000);
    
    // Initial cleanup after 1 minute
    setTimeout(() => this.performCleanup(), 60000);
  }

  // Stop the cleanup service
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Cache cleanup service stopped');
  }

  // Perform cleanup on all registered caches
  performCleanup() {
    let totalCleaned = 0;
    const memUsage = process.memoryUsage();
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    console.log(`🧹 Starting cache cleanup - Current heap: ${heapUsedMB}MB`);
    
    for (const [name, config] of this.caches) {
      const cleaned = this.cleanCache(name, config);
      totalCleaned += cleaned;
    }
    
    // Force garbage collection if memory usage is high
    if (heapUsedMB > 200 && global.gc) {
      global.gc();
      const newMemUsage = process.memoryUsage();
      const newHeapUsedMB = Math.round(newMemUsage.heapUsed / 1024 / 1024);
      console.log(`🗑️ Forced GC: ${heapUsedMB}MB → ${newHeapUsedMB}MB`);
    }
    
    if (totalCleaned > 0) {
      console.log(`✅ Cache cleanup completed - Cleaned ${totalCleaned} items`);
    }
  }

  // Clean a specific cache
  cleanCache(name, config) {
    const { cache, maxSize, ttl } = config;
    let cleaned = 0;
    const now = Date.now();
    
    try {
      // Remove expired entries
      for (const [key, value] of cache) {
        if (value && value.timestamp && (now - value.timestamp) > ttl) {
          cache.delete(key);
          cleaned++;
        }
      }
      
      // If cache is still too large, remove oldest entries
      if (cache.size > maxSize) {
        const entriesToRemove = cache.size - maxSize;
        const keys = Array.from(cache.keys());
        
        for (let i = 0; i < entriesToRemove; i++) {
          cache.delete(keys[i]);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} items from ${name} cache (size: ${cache.size})`);
      }
      
    } catch (error) {
      console.error(`❌ Error cleaning ${name} cache:`, error);
    }
    
    return cleaned;
  }

  // Get cleanup stats
  getStats() {
    const stats = {
      isRunning: this.isRunning,
      registeredCaches: this.caches.size,
      cacheStats: {}
    };
    
    for (const [name, config] of this.caches) {
      stats.cacheStats[name] = {
        size: config.cache.size,
        maxSize: config.maxSize,
        lastCleanup: config.lastCleanup
      };
    }
    
    return stats;
  }

  // Force cleanup of all caches
  forceCleanup() {
    console.log('🧹 Forcing cache cleanup...');
    this.performCleanup();
  }

  // Clear all caches completely
  clearAllCaches() {
    console.log('🗑️ Clearing all caches...');
    let totalCleared = 0;
    
    for (const [name, config] of this.caches) {
      const size = config.cache.size;
      config.cache.clear();
      totalCleared += size;
      console.log(`🗑️ Cleared ${name} cache (${size} items)`);
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    console.log(`✅ All caches cleared - ${totalCleared} items removed`);
    return totalCleared;
  }
}

// Create singleton instance
const cacheCleanupService = new CacheCleanupService();

// Handle process termination
process.on('SIGTERM', () => cacheCleanupService.stop());
process.on('SIGINT', () => cacheCleanupService.stop());

export default cacheCleanupService;
