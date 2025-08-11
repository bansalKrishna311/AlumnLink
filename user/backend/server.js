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

import connectDB, { updateLastActivity, isConnectionHealthy } from "./lib/db.js";
import keepAliveService from "./lib/keepAlive.js";
import databaseMonitor from "./lib/dbMonitor.js";
import m0Optimizer from "./lib/m0TierOptimizer.js";
import {
  dbActivityMiddleware,
  dbHealthMiddleware,
  queryOptimizationMiddleware,
  connectionPoolMiddleware
} from "./middleware/dbActivity.middleware.js";

dotenv.config();

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
    dbHealth: isConnectionHealthy(),
    keepAlive: keepAliveService.getStats()
  };
  res.status(200).json(healthStatus);
});

// MongoDB connection status endpoint with M0 optimization stats
app.get("/health/db", async (req, res) => {
  try {
    const dbConnection = await getDbConnection();
    const isHealthy = isConnectionHealthy();
    
    res.status(200).json({
      status: isHealthy ? "healthy" : "unhealthy",
      connection: dbConnection ? "connected" : "disconnected",
      keepAlive: keepAliveService.getStats(),
      performance: databaseMonitor.getStats(),
      m0Optimization: m0Optimizer.getStats(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error.message,
      keepAlive: keepAliveService.getStats(),
      m0Optimization: m0Optimizer.getStats(),
      timestamp: new Date().toISOString()
    });
  }
});

// Connect to database lazily - only when needed
let dbPromise = null;
const getDbConnection = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch(err => {
      console.error('Failed to connect to database:', err);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
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
      setTimeout(() => reject(new Error('DB connection timeout')), 5000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    
    // Track database activity
    updateLastActivity();
    
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({ 
      error: 'Database connection failed', 
      message: 'Service temporarily unavailable',
      retryAfter: 30 // seconds
    });
  }
  // udating cause lokesh ne backend pe muthi maar di
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
app.use("/api/v1/Links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);
app.use('/api/v1/messages', verifySession, messageRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/leads', verifySession, leadRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  // Connect to DB immediately in development
  connectDB().then(() => {
    // Start monitoring services in development
    keepAliveService.start();
    databaseMonitor.startMonitoring();
    m0Optimizer.init();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Auto-cleanup scheduler initialized');
      console.log('MongoDB keep-alive service started');
      console.log('Database performance monitoring started');
      console.log('M0 Tier Optimizer initialized');
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
} else {
  // In production (serverless), start services when first request comes in
  let servicesStarted = false;
  
  app.use((req, res, next) => {
    if (!servicesStarted) {
      servicesStarted = true;
      keepAliveService.start();
      databaseMonitor.startMonitoring();
      m0Optimizer.init();
      console.log('Database services started for production');
    }
    next();
  });
}

// Export for Vercel serverless deployment
// In production, we export the serverless handler without connecting to DB first
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
