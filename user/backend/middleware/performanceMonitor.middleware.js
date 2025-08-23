// performanceMonitor.middleware.js - Real-time API Performance Monitoring
import logger from '../utils/logger.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        success: 0,
        errors: 0,
        byEndpoint: new Map(),
        byMethod: new Map(),
        byStatusCode: new Map()
      },
      responseTime: {
        total: 0,
        count: 0,
        average: 0,
        min: Infinity,
        max: 0,
        p95: 0,
        p99: 0,
        history: [] // Last 1000 requests for percentile calculation
      },
      throughput: {
        current: 0,
        peak: 0,
        requestsPerMinute: 0,
        lastMinuteRequests: []
      },
      memory: {
        peak: 0,
        current: 0,
        averagePerRequest: 0
      },
      slowRequests: [], // Track slow requests (>1s)
      activeRequests: new Map(),
      healthScore: 100
    };
    
    // Start monitoring
    this.startPeriodicReporting();
    this.startMemoryMonitoring();
  }

  // Start request monitoring
  startRequest(req) {
    const requestId = this.generateRequestId();
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();
    
    const requestData = {
      id: requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      startTime,
      startMemory: startMemory.heapUsed,
      timestamp: new Date().toISOString()
    };
    
    this.metrics.activeRequests.set(requestId, requestData);
    req.performanceId = requestId;
    
    return requestId;
  }

  // End request monitoring
  endRequest(req, res) {
    const requestId = req.performanceId;
    if (!requestId || !this.metrics.activeRequests.has(requestId)) {
      return;
    }
    
    const requestData = this.metrics.activeRequests.get(requestId);
    const endTime = process.hrtime.bigint();
    const endMemory = process.memoryUsage();
    
    // Calculate metrics
    const duration = Number(endTime - requestData.startTime) / 1000000; // Convert to milliseconds
    const memoryUsed = endMemory.heapUsed - requestData.startMemory;
    
    // Update request metrics
    this.updateRequestMetrics(requestData, res, duration);
    this.updateResponseTimeMetrics(duration);
    this.updateThroughputMetrics();
    this.updateMemoryMetrics(memoryUsed);
    
    // Track slow requests
    if (duration > 1000) {
      this.trackSlowRequest(requestData, res, duration);
    }
    
    // Log performance for very slow requests
    if (duration > 5000) {
      logger.warn('🐌 Very slow request detected', {
        method: requestData.method,
        url: requestData.url,
        duration: `${Math.round(duration)}ms`,
        status: res.statusCode,
        memory: `${Math.round(memoryUsed / 1024)}KB`
      });
    }
    
    // Clean up
    this.metrics.activeRequests.delete(requestId);
    
    // Update health score
    this.calculateHealthScore();
  }

  // Generate unique request ID
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Update request metrics
  updateRequestMetrics(requestData, res, duration) {
    const { method, url } = requestData;
    const statusCode = res.statusCode;
    
    // Total requests
    this.metrics.requests.total++;
    
    // Success/error count
    if (statusCode >= 200 && statusCode < 400) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.errors++;
    }
    
    // By endpoint
    const endpoint = this.normalizeEndpoint(url);
    const endpointStats = this.metrics.requests.byEndpoint.get(endpoint) || {
      count: 0, totalTime: 0, avgTime: 0, errors: 0
    };
    endpointStats.count++;
    endpointStats.totalTime += duration;
    endpointStats.avgTime = endpointStats.totalTime / endpointStats.count;
    if (statusCode >= 400) endpointStats.errors++;
    this.metrics.requests.byEndpoint.set(endpoint, endpointStats);
    
    // By method
    const methodStats = this.metrics.requests.byMethod.get(method) || { count: 0, errors: 0 };
    methodStats.count++;
    if (statusCode >= 400) methodStats.errors++;
    this.metrics.requests.byMethod.set(method, methodStats);
    
    // By status code
    const statusStats = this.metrics.requests.byStatusCode.get(statusCode) || { count: 0 };
    statusStats.count++;
    this.metrics.requests.byStatusCode.set(statusCode, statusStats);
  }

  // Update response time metrics
  updateResponseTimeMetrics(duration) {
    const rt = this.metrics.responseTime;
    
    rt.total += duration;
    rt.count++;
    rt.average = rt.total / rt.count;
    rt.min = Math.min(rt.min, duration);
    rt.max = Math.max(rt.max, duration);
    
    // Keep last 1000 requests for percentile calculation
    rt.history.push(duration);
    if (rt.history.length > 1000) {
      rt.history.shift();
    }
    
    // Calculate percentiles
    if (rt.history.length > 10) {
      const sorted = [...rt.history].sort((a, b) => a - b);
      rt.p95 = sorted[Math.floor(sorted.length * 0.95)];
      rt.p99 = sorted[Math.floor(sorted.length * 0.99)];
    }
  }

  // Update throughput metrics
  updateThroughputMetrics() {
    const now = Date.now();
    const tp = this.metrics.throughput;
    
    // Current active requests
    tp.current = this.metrics.activeRequests.size;
    tp.peak = Math.max(tp.peak, tp.current);
    
    // Requests per minute
    tp.lastMinuteRequests.push(now);
    tp.lastMinuteRequests = tp.lastMinuteRequests.filter(time => now - time < 60000);
    tp.requestsPerMinute = tp.lastMinuteRequests.length;
  }

  // Update memory metrics
  updateMemoryMetrics(memoryUsed) {
    const current = process.memoryUsage().heapUsed;
    const mem = this.metrics.memory;
    
    mem.current = current;
    mem.peak = Math.max(mem.peak, current);
    
    if (this.metrics.requests.total > 0) {
      mem.averagePerRequest = (mem.averagePerRequest * (this.metrics.requests.total - 1) + memoryUsed) / this.metrics.requests.total;
    }
  }

  // Track slow requests
  trackSlowRequest(requestData, res, duration) {
    const slowRequest = {
      method: requestData.method,
      url: requestData.url,
      duration: Math.round(duration),
      status: res.statusCode,
      timestamp: requestData.timestamp,
      userAgent: requestData.userAgent,
      ip: requestData.ip
    };
    
    this.metrics.slowRequests.push(slowRequest);
    
    // Keep only last 100 slow requests
    if (this.metrics.slowRequests.length > 100) {
      this.metrics.slowRequests.shift();
    }
    
    // Log slow request
    logger.warn('🐌 Slow request detected', slowRequest);
  }

  // Normalize endpoint for grouping
  normalizeEndpoint(url) {
    return url
      .replace(/\/\d+/g, '/:id') // Replace numeric IDs
      .replace(/\/[a-fA-F0-9]{24}/g, '/:id') // Replace MongoDB ObjectIds
      .replace(/\/[a-fA-F0-9-]{36}/g, '/:uuid') // Replace UUIDs
      .split('?')[0]; // Remove query parameters
  }

  // Calculate overall health score
  calculateHealthScore() {
    let score = 100;
    const rt = this.metrics.responseTime;
    const req = this.metrics.requests;
    
    // Penalize high average response time
    if (rt.average > 1000) score -= 20;
    else if (rt.average > 500) score -= 10;
    else if (rt.average > 200) score -= 5;
    
    // Penalize high error rate
    const errorRate = req.total > 0 ? (req.errors / req.total) * 100 : 0;
    if (errorRate > 10) score -= 30;
    else if (errorRate > 5) score -= 15;
    else if (errorRate > 1) score -= 5;
    
    // Penalize many slow requests
    const slowRequestRate = req.total > 0 ? (this.metrics.slowRequests.length / req.total) * 100 : 0;
    if (slowRequestRate > 5) score -= 20;
    else if (slowRequestRate > 2) score -= 10;
    
    // Penalize high memory usage
    const memoryMB = this.metrics.memory.current / 1024 / 1024;
    if (memoryMB > 512) score -= 15;
    else if (memoryMB > 256) score -= 10;
    else if (memoryMB > 128) score -= 5;
    
    this.metrics.healthScore = Math.max(0, Math.round(score));
  }

  // Get comprehensive metrics
  getMetrics() {
    return {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      ...this.metrics,
      responseTime: {
        ...this.metrics.responseTime,
        average: Math.round(this.metrics.responseTime.average * 100) / 100,
        min: Math.round(this.metrics.responseTime.min * 100) / 100,
        max: Math.round(this.metrics.responseTime.max * 100) / 100,
        p95: Math.round(this.metrics.responseTime.p95 * 100) / 100,
        p99: Math.round(this.metrics.responseTime.p99 * 100) / 100
      },
      memory: {
        ...this.metrics.memory,
        current: `${Math.round(this.metrics.memory.current / 1024 / 1024 * 100) / 100}MB`,
        peak: `${Math.round(this.metrics.memory.peak / 1024 / 1024 * 100) / 100}MB`,
        averagePerRequest: `${Math.round(this.metrics.memory.averagePerRequest / 1024 * 100) / 100}KB`
      },
      requests: {
        ...this.metrics.requests,
        errorRate: this.metrics.requests.total > 0 
          ? `${Math.round((this.metrics.requests.errors / this.metrics.requests.total) * 100 * 100) / 100}%`
          : '0%',
        successRate: this.metrics.requests.total > 0 
          ? `${Math.round((this.metrics.requests.success / this.metrics.requests.total) * 100 * 100) / 100}%`
          : '0%'
      }
    };
  }

  // Get top slow endpoints
  getSlowEndpoints(limit = 10) {
    const endpoints = Array.from(this.metrics.requests.byEndpoint.entries())
      .map(([endpoint, stats]) => ({ endpoint, ...stats }))
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit);
    
    return endpoints.map(ep => ({
      ...ep,
      avgTime: `${Math.round(ep.avgTime)}ms`,
      errorRate: ep.count > 0 ? `${Math.round((ep.errors / ep.count) * 100)}%` : '0%'
    }));
  }

  // Start periodic reporting
  startPeriodicReporting() {
    setInterval(() => {
      const metrics = this.getMetrics();
      
      logger.info('📊 Performance Report', {
        healthScore: metrics.healthScore,
        totalRequests: metrics.requests.total,
        avgResponseTime: metrics.responseTime.average,
        errorRate: metrics.requests.errorRate,
        memoryUsage: metrics.memory.current,
        throughput: `${metrics.throughput.requestsPerMinute}/min`
      });
      
      // Alert on poor performance
      if (metrics.healthScore < 70) {
        logger.warn('⚠️ Performance degradation detected', {
          healthScore: metrics.healthScore,
          avgResponseTime: metrics.responseTime.average,
          errorRate: metrics.requests.errorRate
        });
      }
      
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Start memory monitoring
  startMemoryMonitoring() {
    setInterval(() => {
      const usage = process.memoryUsage();
      
      // Alert on high memory usage
      const heapUsedMB = usage.heapUsed / 1024 / 1024;
      if (heapUsedMB > 400) {
        logger.warn('⚠️ High memory usage detected', {
          heapUsed: `${Math.round(heapUsedMB)}MB`,
          heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(usage.external / 1024 / 1024)}MB`
        });
      }
      
    }, 2 * 60 * 1000); // Every 2 minutes
  }

  // Reset metrics (useful for testing)
  reset() {
    this.metrics = {
      requests: { total: 0, success: 0, errors: 0, byEndpoint: new Map(), byMethod: new Map(), byStatusCode: new Map() },
      responseTime: { total: 0, count: 0, average: 0, min: Infinity, max: 0, p95: 0, p99: 0, history: [] },
      throughput: { current: 0, peak: 0, requestsPerMinute: 0, lastMinuteRequests: [] },
      memory: { peak: 0, current: 0, averagePerRequest: 0 },
      slowRequests: [],
      activeRequests: new Map(),
      healthScore: 100
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Express middleware
export const performanceMiddleware = (req, res, next) => {
  // Start monitoring
  performanceMonitor.startRequest(req);
  
  // Hook into response end event
  res.on('finish', () => {
    performanceMonitor.endRequest(req, res);
  });
  
  next();
};

export { performanceMonitor };
export default performanceMonitor;
