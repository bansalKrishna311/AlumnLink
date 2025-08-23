// responseCache.middleware.js - In-Memory Response Caching for Better Performance
import logger from '../utils/logger.js';

class ResponseCache {
  constructor() {
    this.cache = new Map();
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      evictions: 0
    };
    
    // Cache configuration
    this.config = {
      maxSize: 200, // Maximum number of cached responses
      maxAge: 5 * 60 * 1000, // 5 minutes default TTL
      maxMemory: 100 * 1024 * 1024, // 100MB max memory usage
      cleanupInterval: 2 * 60 * 1000 // Cleanup every 2 minutes
    };
    
    // Start periodic cleanup
    this.startCleanupTimer();
  }

  // Generate cache key from request
  generateCacheKey(req) {
    const { method, originalUrl, user } = req;
    const userId = user?.id || 'anonymous';
    const query = JSON.stringify(req.query);
    return `${method}:${originalUrl}:${userId}:${query}`;
  }

  // Check if request should be cached
  shouldCache(req, res) {
    // Only cache GET requests
    if (req.method !== 'GET') return false;
    
    // Don't cache if response has errors
    if (res.statusCode >= 400) return false;
    
    // Don't cache real-time endpoints
    const realTimeEndpoints = ['/api/messages', '/api/notifications/unread'];
    if (realTimeEndpoints.some(endpoint => req.originalUrl.includes(endpoint))) {
      return false;
    }
    
    // Don't cache if response is too large (> 5MB)
    const contentLength = res.get('content-length');
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      return false;
    }
    
    return true;
  }

  // Get cached response
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      this.cacheStats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      this.cacheStats.misses++;
      return null;
    }
    
    // Update access time for LRU
    cached.lastAccessed = Date.now();
    this.cacheStats.hits++;
    
    return cached;
  }

  // Store response in cache
  set(key, data, headers = {}, customTTL = null) {
    const ttl = customTTL || this.config.maxAge;
    const expiresAt = Date.now() + ttl;
    
    const cacheEntry = {
      data,
      headers,
      expiresAt,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      size: this.estimateSize(data)
    };
    
    // Check memory usage before adding
    if (this.getCurrentMemoryUsage() + cacheEntry.size > this.config.maxMemory) {
      this.evictLRU();
    }
    
    // Evict old entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, cacheEntry);
    this.cacheStats.sets++;
    
    logger.debug('📦 Response cached', { 
      key: key.substring(0, 50) + '...', 
      size: `${Math.round(cacheEntry.size / 1024)}KB`,
      ttl: `${Math.round(ttl / 1000)}s`
    });
  }

  // Estimate memory size of data
  estimateSize(data) {
    return JSON.stringify(data).length * 2; // Rough estimate (UTF-16)
  }

  // Get current memory usage
  getCurrentMemoryUsage() {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  // Evict least recently used entries
  evictLRU() {
    if (this.cache.size === 0) return;
    
    let oldestKey = null;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.cacheStats.evictions++;
    }
  }

  // Clear expired entries
  clearExpired() {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    if (cleared > 0) {
      logger.debug(`🧹 Cleared ${cleared} expired cache entries`);
    }
    
    return cleared;
  }

  // Start cleanup timer
  startCleanupTimer() {
    setInterval(() => {
      this.clearExpired();
    }, this.config.cleanupInterval);
  }

  // Clear cache for specific patterns
  invalidate(pattern) {
    let cleared = 0;
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        cleared++;
      }
    }
    
    logger.info(`🗑️ Invalidated ${cleared} cache entries matching: ${pattern}`);
    return cleared;
  }

  // Clear all cache
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    logger.info(`🗑️ Cleared all cache (${size} entries)`);
  }

  // Get cache statistics
  getStats() {
    const hitRate = this.cacheStats.hits + this.cacheStats.misses > 0 
      ? (this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) * 100).toFixed(2)
      : 0;
    
    return {
      entries: this.cache.size,
      maxSize: this.config.maxSize,
      memoryUsage: `${Math.round(this.getCurrentMemoryUsage() / 1024 / 1024 * 100) / 100}MB`,
      maxMemory: `${Math.round(this.config.maxMemory / 1024 / 1024)}MB`,
      hitRate: `${hitRate}%`,
      ...this.cacheStats
    };
  }
}

// Create singleton instance
const responseCache = new ResponseCache();

// Caching middleware
export const cacheMiddleware = (customTTL = null) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    const cacheKey = responseCache.generateCacheKey(req);
    const cached = responseCache.get(cacheKey);
    
    // Return cached response if available
    if (cached) {
      // Set cached headers
      Object.entries(cached.headers).forEach(([key, value]) => {
        res.set(key, value);
      });
      
      // Add cache status headers
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-Age', Math.round((Date.now() - cached.createdAt) / 1000));
      
      return res.json(cached.data);
    }
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      // Check if we should cache this response
      if (responseCache.shouldCache(req, res)) {
        // Extract relevant headers
        const headers = {
          'content-type': res.get('content-type'),
          'cache-control': res.get('cache-control') || 'public, max-age=300'
        };
        
        // Cache the response
        responseCache.set(cacheKey, data, headers, customTTL);
      }
      
      // Add cache status header
      res.set('X-Cache', 'MISS');
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Cache invalidation middleware for POST/PUT/DELETE operations
export const cacheInvalidationMiddleware = (patterns = []) => {
  return (req, res, next) => {
    // Store original methods
    const originalJson = res.json;
    const originalSend = res.send;
    
    const invalidateCache = () => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        // Auto-detect invalidation patterns based on route
        const autoPatterns = [];
        
        if (req.originalUrl.includes('/posts')) {
          autoPatterns.push('/api/posts', '/api/feed');
        }
        if (req.originalUrl.includes('/users')) {
          autoPatterns.push('/api/users', '/api/suggestions');
        }
        if (req.originalUrl.includes('/messages')) {
          autoPatterns.push('/api/messages', '/api/conversations');
        }
        
        // Combine patterns
        const allPatterns = [...patterns, ...autoPatterns];
        
        allPatterns.forEach(pattern => {
          responseCache.invalidate(pattern);
        });
      }
    };
    
    // Override response methods
    res.json = function(data) {
      invalidateCache();
      return originalJson.call(this, data);
    };
    
    res.send = function(data) {
      invalidateCache();
      return originalSend.call(this, data);
    };
    
    next();
  };
};

// Specific caching durations for different endpoints
export const cacheStrategies = {
  // Static/rarely changing data - 30 minutes
  static: cacheMiddleware(30 * 60 * 1000),
  
  // User profiles - 10 minutes
  profile: cacheMiddleware(10 * 60 * 1000),
  
  // Posts/feed - 2 minutes
  feed: cacheMiddleware(2 * 60 * 1000),
  
  // Search results - 5 minutes
  search: cacheMiddleware(5 * 60 * 1000),
  
  // Trending/popular content - 15 minutes
  trending: cacheMiddleware(15 * 60 * 1000),
  
  // Real-time data - 30 seconds
  realtime: cacheMiddleware(30 * 1000)
};

export { responseCache };
export default responseCache;
