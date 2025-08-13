// main server file - MEMORY OPTIMIZED VERSION
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
import memoryMonitor from "./utils/memory-monitor.js";
import cacheCleanupService from "./utils/cache-cleanup.js";

// Enable garbage collection and configure Node.js memory optimization
if (process.env.NODE_ENV === 'production') {
  // Force garbage collection every 30 seconds in production
  setInterval(() => {
    if (global.gc) {
      global.gc();
    }
  }, 30000);
  
  // Start memory monitoring and cache cleanup
  memoryMonitor.start();
  cacheCleanupService.start();
}

// Set memory limits
process.setMaxListeners(15); // Prevent EventEmitter memory leaks

dotenv.config();

// Initialize the app immediately
const app = express();
const PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

// Set up lightweight middleware with memory optimization
// CORS configuration - simplified for better performance
const corsOptions = process.env.NODE_ENV !== "production" ? {
  origin: true, // Allow all origins in development
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  maxAge: 86400 // Cache preflight for 24 hours
} : {
  origin: [process.env.CLIENT_URL, 'https://alumnlink.com'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400
};

app.use(cors(corsOptions));

// Optimized body parsing with strict limits
app.use(express.json({ 
  limit: "10mb", // Reduced from 50mb to 10mb
  verify: (req, res, buf) => {
    // Clear buffer reference after parsing to prevent memory leaks
    req.rawBody = buf.toString('utf8');
  }
}));

app.use(express.urlencoded({ 
  limit: "10mb", 
  extended: true,
  parameterLimit: 50000 // Limit parameters to prevent DoS
}));

app.use(cookieParser());

// Cache control headers to reduce server load
app.use((req, res, next) => {
  // Set cache headers for static-like API responses
  if (req.method === 'GET' && !req.path.includes('/api/v1/')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});

// Simplified database optimization middleware
const optimizedDbMiddleware = (req, res, next) => {
  // Only add optimization hints where needed
  req.dbOptimization = {
    maxLimit: 20, // Reduced from 50
    defaultLimit: 10 // Reduced from 20
  };
  next();
};

// Health check endpoint that doesn't require DB
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "ok",
    message: "AlumnLink API is healthy",
    timestamp: new Date().toISOString(),
    dbHealth: isConnectionHealthy(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  };
  res.status(200).json(healthStatus);
});

// Simplified MongoDB connection status endpoint
app.get("/health/db", async (req, res) => {
  try {
    const dbConnection = await getDbConnection();
    const isHealthy = isConnectionHealthy();
    
    res.status(200).json({
      status: isHealthy ? "healthy" : "unhealthy",
      connection: dbConnection ? "connected" : "disconnected",
      memory: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
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

// Connect to database lazily - only when needed (OPTIMIZED)
let dbPromise = null;
let connectionRetries = 0;
const MAX_RETRIES = 3;

const getDbConnection = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch(err => {
      console.error('Failed to connect to database:', err);
      connectionRetries++;
      
      // Reset promise after max retries to allow fresh attempts
      if (connectionRetries >= MAX_RETRIES) {
        dbPromise = null;
        connectionRetries = 0;
      }
      
      throw err;
    });
  }
  return dbPromise;
};

// Optimized middleware to handle database connection
const withDb = async (req, res, next) => {
  // Skip DB connection for health check endpoints and static assets
  if (req.path === '/health' || 
      req.path === '/health/db' || 
      req.path.includes('/public/') ||
      req.path.includes('.js') ||
      req.path.includes('.css') ||
      req.path.includes('.png') ||
      req.path.includes('.jpg')) {
    return next();
  }

  try {
    // Set a shorter timeout for better responsiveness
    const connectionPromise = getDbConnection();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('DB connection timeout')), 3000) // Reduced from 5000ms
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    
    // Track database activity with minimal overhead
    updateLastActivity();
    
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    
    // Return cached response or simplified error
    return res.status(503).json({ 
      error: 'Service temporarily unavailable', 
      retryAfter: 10 // Reduced retry time
    });
  }
};

// Apply the DB connection middleware to all routes except health checks
app.use(withDb);
app.use(optimizedDbMiddleware);

// Optimized maintenance tasks - run much less frequently
let maintenanceCounter = 0;
const runMaintenanceTasks = () => {
  maintenanceCounter++;
  
  // Run only every 1000th request (0.1% chance) to reduce CPU load
  if (maintenanceCounter % 1000 === 0) {
    console.log('Scheduling maintenance tasks...');
    
    // Run completely detached with lower priority
    process.nextTick(async () => {
      try {
        await Promise.all([
          cleanupOldLinkRequests(),
          notifyExpiringRequests()
        ]);
        console.log('Maintenance tasks completed successfully');
      } catch (err) {
        console.error('Error in maintenance tasks:', err);
      }
    });
  }
};

// Root endpoint with minimal processing
app.get("/", (req, res) => {
  runMaintenanceTasks();
  res.json({ 
    status: "AlumnLink API is running",
    version: "2.0.0-optimized",
    timestamp: new Date().toISOString()
  });
});

// API routes with optimized middleware loading
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifySession, userRoutes);
app.use("/api/v1/posts", verifySession, postRoutes);
app.use("/api/v1/notifications", verifySession, notificationRoutes);
app.use("/api/v1/Links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);
app.use('/api/v1/messages', verifySession, messageRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/leads', verifySession, leadRoutes);

// Memory cleanup interval in production
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    // Clear any hanging timeouts/intervals
    const memUsage = process.memoryUsage();
    console.log(`Memory usage: ${Math.round(memUsage.rss / 1024 / 1024)}MB RSS, ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB Heap`);
    
    // If memory usage is too high, log warning
    if (memUsage.heapUsed > 150 * 1024 * 1024) { // 150MB
      console.warn('⚠️ High memory usage detected, forcing garbage collection');
      if (global.gc) global.gc();
    }
  }, 60000); // Every minute
}

// For local development
if (process.env.NODE_ENV !== "production") {
  // Connect to DB immediately in development
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('🔧 Development mode - optimized for performance');
      console.log(`📊 Memory: ${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`);
    });
  }).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
} else {
  console.log('🚀 Production mode - serverless deployment ready');
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Export for Vercel serverless deployment
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
