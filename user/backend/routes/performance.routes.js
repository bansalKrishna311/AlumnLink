// performanceRoutes.js - Admin routes for monitoring system performance
import express from 'express';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';
import indexOptimizer from '../lib/indexOptimizer.js';
import responseCache from '../middleware/responseCache.middleware.js';
import performanceMonitor from '../middleware/performanceMonitor.middleware.js';
import queryOptimizer from '../middleware/queryOptimizer.middleware.js';
import { SmartConnectionManager } from '../lib/smartConnectionManager.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Get comprehensive performance overview
router.get('/overview', protectRoute, isAdmin, async (req, res) => {
  try {
    const overview = {
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
        nodeVersion: process.version
      },
      performance: performanceMonitor.getMetrics(),
      database: {
        connection: SmartConnectionManager.getConnectionStatus(),
        optimization: queryOptimizer.getStats()
      },
      cache: responseCache.getStats(),
      slowEndpoints: performanceMonitor.getSlowEndpoints(5)
    };
    
    res.json({
      success: true,
      data: overview
    });
    
  } catch (error) {
    logger.error('Performance overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get performance overview',
      error: error.message
    });
  }
});

// Get detailed performance metrics
router.get('/metrics', protectRoute, isAdmin, async (req, res) => {
  try {
    const metrics = {
      performance: performanceMonitor.getMetrics(),
      cache: responseCache.getStats(),
      database: queryOptimizer.getStats(),
      connection: SmartConnectionManager.getConnectionStatus()
    };
    
    res.json({
      success: true,
      data: metrics
    });
    
  } catch (error) {
    logger.error('Performance metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get performance metrics',
      error: error.message
    });
  }
});

// Get database optimization status
router.get('/database', protectRoute, isAdmin, async (req, res) => {
  try {
    const [indexInfo, optimizationStats, connectionStatus] = await Promise.all([
      indexOptimizer.getIndexInfo(),
      queryOptimizer.getStats(),
      SmartConnectionManager.getConnectionStatus()
    ]);
    
    res.json({
      success: true,
      data: {
        indexes: indexInfo,
        optimization: optimizationStats,
        connection: connectionStatus
      }
    });
    
  } catch (error) {
    logger.error('Database performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get database performance',
      error: error.message
    });
  }
});

// Optimize database indexes
router.post('/database/optimize-indexes', protectRoute, isAdmin, async (req, res) => {
  try {
    logger.info('Manual database index optimization triggered by admin');
    const result = await indexOptimizer.optimizeAllIndexes();
    
    res.json({
      success: result.success,
      message: result.success ? 'Database indexes optimized successfully' : 'Index optimization failed',
      data: result
    });
    
  } catch (error) {
    logger.error('Index optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize database indexes',
      error: error.message
    });
  }
});

// Analyze index performance
router.get('/database/index-analysis', protectRoute, isAdmin, async (req, res) => {
  try {
    const analysis = await indexOptimizer.analyzeIndexPerformance();
    
    res.json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    logger.error('Index analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze index performance',
      error: error.message
    });
  }
});

// Clean up unused indexes
router.post('/database/cleanup-indexes', protectRoute, isAdmin, async (req, res) => {
  try {
    logger.info('Manual index cleanup triggered by admin');
    const cleanup = await indexOptimizer.cleanupUnusedIndexes();
    
    res.json({
      success: true,
      message: 'Index cleanup completed',
      data: {
        cleanedIndexes: cleanup
      }
    });
    
  } catch (error) {
    logger.error('Index cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup indexes',
      error: error.message
    });
  }
});

// Get cache statistics
router.get('/cache', protectRoute, isAdmin, (req, res) => {
  try {
    const stats = responseCache.getStats();
    
    res.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    logger.error('Cache stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get cache statistics',
      error: error.message
    });
  }
});

// Clear response cache
router.post('/cache/clear', protectRoute, isAdmin, (req, res) => {
  try {
    const { pattern } = req.body;
    
    if (pattern) {
      const cleared = responseCache.invalidate(pattern);
      logger.info(`Admin cleared cache pattern: ${pattern}, entries: ${cleared}`);
      
      res.json({
        success: true,
        message: `Cleared ${cleared} cache entries matching pattern: ${pattern}`,
        data: { pattern, cleared }
      });
    } else {
      responseCache.clear();
      logger.info('Admin cleared all cache');
      
      res.json({
        success: true,
        message: 'All cache cleared successfully'
      });
    }
    
  } catch (error) {
    logger.error('Cache clear error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

// Get slow requests analysis
router.get('/slow-requests', protectRoute, isAdmin, (req, res) => {
  try {
    const metrics = performanceMonitor.getMetrics();
    const analysis = {
      slowRequests: metrics.slowRequests,
      slowEndpoints: performanceMonitor.getSlowEndpoints(10),
      averageResponseTime: metrics.responseTime.average,
      p95ResponseTime: metrics.responseTime.p95,
      p99ResponseTime: metrics.responseTime.p99
    };
    
    res.json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    logger.error('Slow requests analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get slow requests analysis',
      error: error.message
    });
  }
});

// Reset performance metrics
router.post('/reset-metrics', protectRoute, isAdmin, (req, res) => {
  try {
    performanceMonitor.reset();
    logger.info('Performance metrics reset by admin');
    
    res.json({
      success: true,
      message: 'Performance metrics reset successfully'
    });
    
  } catch (error) {
    logger.error('Reset metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset performance metrics',
      error: error.message
    });
  }
});

// Get system health check
router.get('/health', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        limit: Math.round(process.memoryUsage().rss / 1024 / 1024)
      },
      database: {
        connected: SmartConnectionManager.isConnected(),
        status: SmartConnectionManager.getConnectionStatus()
      },
      performance: {
        healthScore: performanceMonitor.getMetrics().healthScore,
        activeRequests: performanceMonitor.getMetrics().throughput.current,
        averageResponseTime: Math.round(performanceMonitor.getMetrics().responseTime.average)
      },
      cache: {
        entries: responseCache.getStats().entries,
        hitRate: responseCache.getStats().hitRate,
        memoryUsage: responseCache.getStats().memoryUsage
      }
    };
    
    // Determine overall status
    if (health.performance.healthScore < 50 || !health.database.connected) {
      health.status = 'unhealthy';
    } else if (health.performance.healthScore < 80) {
      health.status = 'degraded';
    }
    
    const statusCode = health.status === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json({
      success: health.status === 'healthy',
      data: health
    });
    
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(503).json({
      success: false,
      status: 'unhealthy',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Get real-time performance dashboard data
router.get('/dashboard', protectRoute, isAdmin, async (req, res) => {
  try {
    const performance = performanceMonitor.getMetrics();
    const cache = responseCache.getStats();
    const connection = SmartConnectionManager.getConnectionStatus();
    
    const dashboard = {
      timestamp: new Date().toISOString(),
      overview: {
        healthScore: performance.healthScore,
        totalRequests: performance.requests.total,
        errorRate: performance.requests.errorRate,
        averageResponseTime: Math.round(performance.responseTime.average),
        activeRequests: performance.throughput.current,
        cacheHitRate: cache.hitRate,
        memoryUsage: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
      },
      charts: {
        responseTime: {
          average: performance.responseTime.average,
          p95: performance.responseTime.p95,
          p99: performance.responseTime.p99,
          history: performance.responseTime.history.slice(-50) // Last 50 requests
        },
        throughput: {
          current: performance.throughput.current,
          peak: performance.throughput.peak,
          requestsPerMinute: performance.throughput.requestsPerMinute
        },
        errors: {
          total: performance.requests.errors,
          rate: performance.requests.errorRate,
          byStatusCode: Object.fromEntries(performance.requests.byStatusCode)
        }
      },
      topEndpoints: performanceMonitor.getSlowEndpoints(5),
      recentSlowRequests: performance.slowRequests.slice(-10),
      systemInfo: {
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    res.json({
      success: true,
      data: dashboard
    });
    
  } catch (error) {
    logger.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

export default router;
