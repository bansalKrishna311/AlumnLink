// Import axios instance
import { axiosInstance } from '@/lib/axios';

// Request deduplication and caching utility
class RequestManager {
  constructor() {
    this.pendingRequests = new Map();
    this.cache = new Map();
    this.cacheExpiry = new Map();
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

  // Set data in cache with expiry
  setCachedData(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + ttl);
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
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
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
