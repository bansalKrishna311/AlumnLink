// dbActivity.middleware.js - Database Activity Tracking and Optimization
import { updateLastActivity, isConnectionHealthy, forceReconnect } from '../lib/db.js';
import keepAliveService from '../lib/keepAlive.js';

// Track database activity and optimize for M0 tier
const dbActivityMiddleware = async (req, res, next) => {
  // Update activity timestamp
  updateLastActivity();

  // Check connection health before proceeding
  if (!isConnectionHealthy()) {
    console.log('Connection health check failed, attempting reconnection...');
    try {
      await forceReconnect();
    } catch (error) {
      console.error('Failed to reconnect:', error);
      return res.status(503).json({
        error: 'Database connection unavailable',
        message: 'Please try again in a moment'
      });
    }
  }

  // Add database optimization headers for responses
  res.setHeader('X-DB-Optimized', 'true');
  
  // Track request completion for activity monitoring
  const originalSend = res.send;
  res.send = function(data) {
    updateLastActivity();
    return originalSend.call(this, data);
  };

  next();
};

// Middleware to add database health info to responses (development only)
const dbHealthMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const originalJson = res.json;
    res.json = function(data) {
      const healthInfo = {
        dbHealth: isConnectionHealthy(),
        keepAliveStats: keepAliveService.getStats()
      };
      
      // Add health info to response in development
      if (data && typeof data === 'object') {
        data._dbHealth = healthInfo;
      }
      
      return originalJson.call(this, data);
    };
  }
  next();
};

// Query optimization middleware for MongoDB M0 tier
const queryOptimizationMiddleware = (req, res, next) => {
  // Add query optimization hints for common patterns
  req.dbOptimization = {
    // Limit large queries automatically
    maxLimit: 50,
    defaultLimit: 20,
    
    // Optimize sort operations
    optimizeSort: (sort) => {
      // Prefer indexed fields for sorting
      if (sort && typeof sort === 'object') {
        // Convert to use indexed fields where possible
        const optimizedSort = {};
        Object.keys(sort).forEach(key => {
          // Map common sort fields to indexed equivalents
          switch (key) {
            case 'createdAt':
            case 'updatedAt':
            case '_id':
              optimizedSort[key] = sort[key];
              break;
            default:
              optimizedSort[key] = sort[key];
          }
        });
        return optimizedSort;
      }
      return sort;
    },
    
    // Optimize pagination
    optimizePagination: (page = 1, limit = 20) => {
      const optimizedLimit = Math.min(limit, req.dbOptimization.maxLimit);
      const skip = (page - 1) * optimizedLimit;
      return { skip, limit: optimizedLimit };
    }
  };

  next();
};

// Connection pool monitoring middleware
const connectionPoolMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // Async import for ES modules
    import('mongoose').then(({ default: mongoose }) => {
      const connection = mongoose.connection;
      
      if (connection && connection.db) {
        // Log connection pool stats occasionally
        if (Math.random() < 0.01) { // 1% of requests
          const stats = connection.db.serverConfig?.connections();
          console.log('Connection Pool Stats:', {
            available: stats?.available || 'unknown',
            created: stats?.created || 'unknown',
            poolSize: connection.db.serverConfig?.poolSize || 'unknown'
          });
        }
      }
    }).catch(err => {
      // Silently ignore import errors in middleware
    });
  }
  next();
};

export {
  dbActivityMiddleware,
  dbHealthMiddleware,
  queryOptimizationMiddleware,
  connectionPoolMiddleware
};
