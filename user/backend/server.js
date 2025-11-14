// main server file
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import serverless from "serverless-http";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import LinkRoutes from "./routes/Link.route.js";
import messageRoutes from "./routes/message.route.js";
import contactRoutes from "./routes/contact.route.js";
import leadRoutes from "./routes/lead.route.js";
import { verifySession } from "./middleware/auth.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import { cleanupOldLinkRequests, notifyExpiringRequests } from "./utils/cleanup.js";

import connectionManager from "./lib/smartConnectionManager.js";
import {
  dbActivityMiddleware,
  dbHealthMiddleware,
  queryOptimizationMiddleware,
  connectionPoolMiddleware
} from "./middleware/dbActivity.middleware.js";
import { loadSecrets, validateRequiredSecrets } from "./lib/secretsManager.js";

// Load .env file first (will be overridden by AWS secrets if enabled)
dotenv.config();

// Load secrets from AWS Secrets Manager or .env
// This is done at the top level but won't block initialization
const secretsPromise = loadSecrets().catch(error => {
  console.error('Failed to load secrets:', error);
  // Don't exit in production as the app might still work with .env
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Initialize the app immediately
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Set up middleware first without waiting for DB connection
// CORS configuration
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: (origin, callback) => {
        callback(null, origin || "*"); // Allow all origins
      },
      credentials: true,
    })
  );
} else {
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'https://alumnlink.com',
      credentials: true,
    })
  );
}

// Set reasonable body size limits for image uploads
app.use(express.json({ limit: "50mb" })); // Increased from 2mb to 50mb for large base64 images
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Added for form data
app.use(cookieParser());

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
    connectionStats: connectionManager.getStats()
  };
  res.status(200).json(healthStatus);
});

// MongoDB connection status endpoint with unified stats
app.get("/health/db", async (req, res) => {
  try {
    const stats = connectionManager.getStats();
    const isHealthy = connectionManager.isHealthy();
    
    res.status(200).json({
      status: isHealthy ? "healthy" : "unhealthy",
      connection: stats.connection.stateName,
      ...stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
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
    console.log('Scheduling maintenance tasks...');
    // Run completely detached
    setTimeout(async () => {
      try {
        await Promise.all([
          cleanupOldLinkRequests(),
          notifyExpiringRequests()
        ]);
        console.log('Maintenance tasks completed successfully');
      } catch (err) {
        console.error('Error in maintenance tasks:', err);
      }
    }, 100);
  }
};

// Root endpoint with minimal processing
app.get("/", (req, res) => {
  runMaintenanceTasks();
  res.send("AlumnLink API is running");
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifySession, userRoutes);
app.use("/api/v1/posts", verifySession, (req, res, next) => {
  runMaintenanceTasks();
  next();
}, postRoutes);
app.use("/api/v1/notifications", verifySession, notificationRoutes);
app.use("/api/v1/links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);
app.use('/api/v1/messages', verifySession, messageRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/leads', verifySession, leadRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  // Wait for secrets to load, then connect to DB in development
  secretsPromise.then(async () => {
    try {
      // Validate required secrets are present
      validateRequiredSecrets();
      
      await connectionManager.connect();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log('✅ Smart connection manager initialized');
        console.log('🚀 Auto-cleanup scheduler initialized');
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }).catch(error => {
    console.error('Failed to load secrets:', error);
    process.exit(1);
  });
} else {
  // In production (serverless), connection manager handles everything
  // Secrets should be loaded before any requests are processed
  secretsPromise.then(() => {
    console.log('🚀 Production mode - connection manager ready');
    validateRequiredSecrets();
  }).catch(error => {
    console.error('⚠️  Production secrets loading failed, using environment variables');
  });
}

// Export for Vercel serverless deployment
// In production, we export the serverless handler without connecting to DB first
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
