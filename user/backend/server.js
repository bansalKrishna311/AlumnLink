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
import { verifySession } from "./middleware/auth.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import { cleanupOldLinkRequests, notifyExpiringRequests } from "./utils/cleanup.js";

import connectDB, { isDbConnected, reconnectDB, setupEventListeners } from "./lib/db.js";
import dbMonitor from "./utils/dbMonitor.js";
import mongoose from "mongoose";

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

// Set reasonable body size limits
app.use(express.json({ limit: "2mb" })); 
app.use(cookieParser());

// Health check endpoint that doesn't require DB
app.get("/health", async (req, res) => {
  const dbStatus = dbMonitor.getStatus();
  res.status(200).json({ 
    status: "ok", 
    message: "AlumnLink API is healthy",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint for monitoring
app.get("/api/db-status", async (req, res) => {
  const status = dbMonitor.getStatus();
  res.status(status.isConnected ? 200 : 503).json(status);
});

// Connection statistics endpoint
app.get("/api/connection-stats", async (req, res) => {
  const stats = {
    status: dbMonitor.getStatus(),
    mongoose: {
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections || {}),
    },
    server: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
    },
    timestamp: new Date().toISOString()
  };
  res.json(stats);
});

// Enhanced database middleware with simpler logic
const withDb = async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/health') {
    return next();
  }

  if (!isDbConnected()) {
    return res.status(503).json({
      error: 'Database unavailable. Try again later.',
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};

// Apply the DB connection middleware to all routes
app.use(withDb);

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

// For local development
if (process.env.NODE_ENV !== "production") {
  // Connect to DB and start monitoring
  const start = async () => {
    try {
      await connectDB();
      dbMonitor.start(); // Starts reconnection monitor
      
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log('✅ Database connection established');
        console.log('🔄 Auto-cleanup scheduler initialized');
        console.log('📡 Database monitoring started');
      });
    } catch (err) {
      console.error('💥 Failed to start server:', err);
      process.exit(1);
    }
  };
  
  start();
} else {
  // In production (Vercel), establish connection and start monitoring
  const initProduction = async () => {
    try {
      await connectDB();
      dbMonitor.start(); // Starts reconnection monitor
      console.log('✅ Production database connection established');
      console.log('📡 Database monitoring started');
    } catch (err) {
      console.error('💥 Failed to connect to database in production:', err);
    }
  };
  
  initProduction();
}

// Export for Vercel serverless deployment
// In production, we export the serverless handler with established DB connection
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
