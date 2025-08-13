// optimized.middleware.js - Lightweight Database Middleware
import { updateLastActivity, isConnectionHealthy } from '../lib/db.js';

// Minimal database activity tracking
const dbActivityMiddleware = (req, res, next) => {
  // Update activity timestamp with minimal overhead
  updateLastActivity();

  // Add simple response tracking
  const originalSend = res.send;
  res.send = function(data) {
    updateLastActivity();
    return originalSend.call(this, data);
  };

  next();
};

// Lightweight query optimization middleware
const queryOptimizationMiddleware = (req, res, next) => {
  // Add minimal optimization hints
  req.dbOptimization = {
    maxLimit: 20,
    defaultLimit: 10,
    
    // Simple pagination helper
    optimizePagination: (page = 1, limit = 10) => {
      const optimizedLimit = Math.min(limit, 20);
      const skip = (page - 1) * optimizedLimit;
      return { skip, limit: optimizedLimit };
    }
  };

  next();
};

// Simple connection health middleware for development
const dbHealthMiddleware = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // Only in development, add minimal health info
    res.setHeader('X-DB-Health', isConnectionHealthy() ? 'healthy' : 'unhealthy');
  }
  next();
};

export {
  dbActivityMiddleware,
  dbHealthMiddleware,
  queryOptimizationMiddleware
};
