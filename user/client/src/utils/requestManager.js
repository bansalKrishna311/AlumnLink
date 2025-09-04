// Import axios instance
import { axiosInstance } from '@/lib/axios';

// Request deduplication and caching utility
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
    this.cache = new Map();
    this.cacheExpiry = new Map();
    this.maxCacheSize = 100; // Maximum number of cached entries
    this.maxMemorySize = 50 * 1024 * 1024; // 50MB max cache size
  }

  // Generate a unique key for the request
  generateKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${url}?${paramString}`;
  }

  // Check if data is in cache and not expired
  getCachedData(key) {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  // Calculate approximate memory usage of cached data
  getMemoryUsage() {
    let totalSize = 0;
    for (const [key, value] of this.cache) {
      totalSize += new Blob([JSON.stringify({ key, value })]).size;
    }
    return totalSize;
  }

  // Remove oldest cache entries when limits are exceeded
  evictOldEntries() {
    // Remove expired entries first
    this.cleanupExpiredEntries();
    
    // If still over limits, remove oldest entries
    while (this.cache.size > this.maxCacheSize || this.getMemoryUsage() > this.maxMemorySize) {
      if (this.cache.size === 0) break;
      
      // Remove the oldest entry (first inserted)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.cacheExpiry.delete(firstKey);
    }
  }

  // Clean up expired cache entries
  cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, expiry] of this.cacheExpiry) {
      if (now > expiry) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    }
  }

  // Set data in cache with expiry and size management
  setCachedData(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default
    // Check if we need to evict entries before adding new one
    this.evictOldEntries();
    
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
    
    // Check again after adding in case this entry is too large
    this.evictOldEntries();
  }

  // Deduplicated request method
  async request(requestFn, key, ttl) {
    // Check cache first
    const cachedData = this.getCachedData(key);
    if (cachedData) {
      return Promise.resolve(cachedData);
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    // Create new request
    const requestPromise = requestFn()
      .then(data => {
        this.setCachedData(key, data, ttl);
        return data;
      })
      .catch(error => {
        throw error;
      })
      .finally(() => {
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, requestPromise);
    return requestPromise;
  }

  // Clear cache for specific key or all
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }

  // Cancel pending request
  cancelRequest(key) {
    this.pendingRequests.delete(key);
  }

  // Get cache statistics
  getCacheStats() {
    this.cleanupExpiredEntries(); // Clean up before reporting stats
    
    return {
      cacheSize: this.cache.size,
      maxCacheSize: this.maxCacheSize,
      pendingRequests: this.pendingRequests.size,
      memoryUsage: this.getMemoryUsage(),
      maxMemorySize: this.maxMemorySize,
      memoryUsagePercentage: Math.round((this.getMemoryUsage() / this.maxMemorySize) * 100),
      expiredEntries: Array.from(this.cacheExpiry.entries())
        .filter(([, expiry]) => Date.now() > expiry).length
    };
  }
}

// Global request manager instance
export const requestManager = new RequestManager();

// Optimized axios wrapper with deduplication
export const optimizedRequest = {
  get: async (url, config = {}) => {
    const key = requestManager.generateKey(url, config.params);
    return requestManager.request(
      () => axiosInstance.get(url, config).then(res => res.data),
      key,
      config.cacheTTL || 5 * 60 * 1000
    );
  },

  post: async (url, data, config = {}) => {
    // POST requests are not cached by default
    return axiosInstance.post(url, data, config).then(res => res.data);
  },

  put: async (url, data, config = {}) => {
    // PUT requests clear related cache
    const keyPattern = url.split('?')[0];
    Array.from(requestManager.cache.keys())
      .filter(key => key.startsWith(keyPattern))
      .forEach(key => requestManager.clearCache(key));
    
    return axiosInstance.put(url, data, config).then(res => res.data);
  },

  delete: async (url, config = {}) => {
    // DELETE requests clear related cache
    const keyPattern = url.split('?')[0];
    Array.from(requestManager.cache.keys())
      .filter(key => key.startsWith(keyPattern))
      .forEach(key => requestManager.clearCache(key));
    
    return axiosInstance.delete(url, config).then(res => res.data);
  },

  // Force refresh - bypass cache
  refresh: async (url, config = {}) => {
    const key = requestManager.generateKey(url, config.params);
    requestManager.clearCache(key);
    return optimizedRequest.get(url, config);
  }
};
