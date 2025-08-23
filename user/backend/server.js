// main server file
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import serverless from "serverless-http";

// Route imports
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import LinkRoutes from "./routes/Link.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";
import leadRoutes from "./routes/lead.route.js";
import adminRoutes from "./routes/admin.routes.js";

// Middleware imports
import { verifySession } from "./middleware/auth.middleware.js";
import connectionManager from "./lib/smartConnectionManager.js";
import { globalErrorHandler, notFoundHandler, requestTimeout } from "./middleware/errorHandler.middleware.js";
import { requestLogger } from "./utils/logger.js";
import { 
  securityHeaders, 
  compressionMiddleware, 
  customSecurity, 
  requestTiming, 
  ipValidation,
  requestSizeLimit,
  corsSecurityEnhancement,
  methodValidation,
  securityLogging,
  contentTypeValidation
} from "./middleware/security.middleware.js";
import { 
  apiLimiter, 
  authLimiter, 
  passwordResetLimiter, 
  uploadLimiter, 
  adminLimiter,
  ddosProtection,
  burstProtection
} from "./middleware/rateLimiting.middleware.js";
import { sanitizeInput } from "./middleware/validation.middleware.js";
import {
  dbActivityMiddleware,
  dbHealthMiddleware,
  queryOptimizationMiddleware,
  connectionPoolMiddleware
} from "./middleware/dbActivity.middleware.js";

// Performance optimization imports
import { performanceMiddleware } from "./middleware/performanceMonitor.middleware.js";
import { cacheStrategies, cacheInvalidationMiddleware } from "./middleware/responseCache.middleware.js";
import { optimizationStrategies } from "./middleware/queryOptimizer.middleware.js";
import indexOptimizer from "./lib/indexOptimizer.js";
import performanceRoutes from "./routes/performance.routes.js";

// Utility imports
import { cleanupOldLinkRequests, notifyExpiringRequests } from "./utils/cleanup.js";
import logger from "./utils/logger.js";

dotenv.config();

// Initialize the app immediately
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware (FIRST - before any other middleware)
app.use(requestTiming);
app.use(securityHeaders);
app.use(compressionMiddleware);
app.use(customSecurity);
app.use(ipValidation);
app.use(methodValidation);
app.use(contentTypeValidation);
app.use(requestSizeLimit);

// DDoS and burst protection
app.use('/api/', ddosProtection);
app.use('/api/', burstProtection);

// Performance monitoring (early in middleware stack)
app.use(performanceMiddleware);

// Request logging
app.use(requestLogger);
app.use(securityLogging);

// Request timeout protection
app.use(requestTimeout(30000)); // 30 second timeout
// CORS configuration with enhanced security
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:5173',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:5173'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn('CORS blocked origin', { origin });
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: [
        process.env.CLIENT_URL,
        'https://alumnlink.com',
        'https://www.alumnlink.com',
        'http://alumnlink.com',
        'http://www.alumnlink.com',
        'http://139.59.66.21:5173',
        'https://139.59.66.21:5173'
      ].filter(Boolean),
      credentials: true,
    })
  );
}

// Enhanced CORS security
app.use(corsSecurityEnhancement);

// Body parsing with size limits and sanitization
app.use(express.json({ 
  limit: "10mb", // Reduced from 50mb for security
  verify: (req, res, buf) => {
    // Verify JSON payload
    try {
      JSON.parse(buf);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  }
}));
app.use(express.urlencoded({ 
  limit: "10mb", 
  extended: true,
  parameterLimit: 100 // Limit URL parameters
}));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// Add database optimization middleware
app.use(connectionPoolMiddleware);
app.use(queryOptimizationMiddleware);
app.use(dbHealthMiddleware);

// Health check endpoint that doesn't require DB
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "ok",
    message: "AlumnLink API is healthy",
    timestamp: new Date().toISOString(),
    dbHealth: connectionManager.isHealthy(),
    connectionStats: connectionManager.getStats(),
    version: "1.0.0",
    environment: process.env.NODE_ENV
  };
  
  logger.debug('Health check requested', healthStatus);
  res.status(200).json(healthStatus);
});

// MongoDB connection status endpoint with unified stats
app.get("/health/db", async (req, res) => {
  try {
    const stats = connectionManager.getStats();
    const isHealthy = connectionManager.isHealthy();
    
    const response = {
      status: isHealthy ? "healthy" : "unhealthy",
      connection: stats.connection.stateName,
      ...stats,
      timestamp: new Date().toISOString()
    };
    
    logger.info('Database health check', response);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Database health check failed', { error: error.message });
    res.status(503).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Connect to database lazily - only when needed
const getDbConnection = async () => {
  try {
    return await connectionManager.connect();
  } catch (error) {
    console.error('Failed to get database connection:', error);
    throw error;
  }
};

// Middleware to handle database connection with activity tracking
const withDb = async (req, res, next) => {
  // Skip DB connection for health check endpoints
  if (req.path === '/health' || req.path === '/health/db') {
    return next();
  }

  try {
    // Set a timeout for the DB connection
    const connectionPromise = getDbConnection();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('DB connection timeout')), 8000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    
    // Track database activity
    connectionManager.updateActivity();
    
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    
    // Check if it's a circuit breaker error
    if (error.message.includes('Circuit breaker')) {
      return res.status(503).json({ 
        error: 'Database temporarily unavailable', 
        message: 'Service is recovering from connection issues',
        retryAfter: 30
      });
    }
    
    return res.status(503).json({ 
      error: 'Database connection failed', 
      message: 'Service temporarily unavailable',
      retryAfter: 15
    });
  }
};

// Apply the DB connection middleware to all routes except health checks
app.use(withDb);
app.use(dbActivityMiddleware);

// Maintenance tasks - executed asynchronously and very rarely
const runMaintenanceTasks = () => {
  if (Math.random() < 0.005) { // 0.5% chance of running
    logger.debug('Scheduling maintenance tasks');
    // Run completely detached
    setTimeout(async () => {
      try {
        await Promise.all([
          cleanupOldLinkRequests(),
          notifyExpiringRequests()
        ]);
        logger.info('Maintenance tasks completed successfully');
      } catch (err) {
        logger.error('Error in maintenance tasks', { error: err.message });
      }
    }, 100);
  }
};

// Root endpoint with minimal processing
app.get("/", (req, res) => {
  runMaintenanceTasks();
  res.json({
    message: "AlumnLink API is running",
    version: "1.0.0",
    status: "active",
    timestamp: new Date().toISOString()
  });
});

// API routes with rate limiting and caching
app.use("/api/v1/auth", authLimiter, passwordResetLimiter, cacheInvalidationMiddleware(), authRoutes);
app.use("/api/v1/users", apiLimiter, verifySession, cacheStrategies.profile, optimizationStrategies.profile, userRoutes);
app.use("/api/v1/posts", apiLimiter, uploadLimiter, verifySession, cacheStrategies.feed, optimizationStrategies.feed, (req, res, next) => {
  runMaintenanceTasks();
  next();
}, cacheInvalidationMiddleware(['/api/v1/posts', '/api/v1/feed']), postRoutes);
app.use("/api/v1/notifications", apiLimiter, verifySession, cacheStrategies.realtime, notificationRoutes);
app.use("/api/v1/Links", apiLimiter, verifySession, cacheStrategies.static, LinkRoutes);
app.use('/api/v1/admin', adminLimiter, verifySession, adminRoutes);
app.use('/api/v1/messages', apiLimiter, verifySession, cacheStrategies.realtime, messageRoutes);
app.use('/api/v1/contact', apiLimiter, contactRoutes);
app.use('/api/v1/leads', apiLimiter, verifySession, cacheStrategies.search, optimizationStrategies.list, leadRoutes);

// Performance monitoring routes (admin only)
app.use('/api/v1/performance', performanceRoutes);

// Catch unmatched routes
app.use(notFoundHandler);

// Global error handler (MUST be last)
app.use(globalErrorHandler);

// For local development
if (process.env.NODE_ENV !== "production") {
  // Connect to DB immediately in development
  connectionManager.connect().then(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info('Smart connection manager initialized');
      logger.info('Auto-cleanup scheduler initialized');
      logger.info('Security middleware active');
      logger.info('Rate limiting enabled');
    });
    
    // Store server instance for graceful shutdown
    global.server = server;
  }).catch(error => {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  });
} else {
  // In production (serverless), connection manager handles everything
  logger.info('Production mode - connection manager ready');
  logger.info('Security middleware active');
  logger.info('Rate limiting enabled');
}

// Export for Vercel serverless deployment
// In production, we export the serverless handler without connecting to DB first
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
