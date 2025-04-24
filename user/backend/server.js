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
import { verifySession } from "./middleware/auth.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import { cleanupOldLinkRequests, notifyExpiringRequests } from "./utils/cleanup.js";

import connectDB from "./lib/db.js";

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
      origin: process.env.CLIENT_URL || 'https://alumnlink.vercel.app',
      credentials: true,
    })
  );
}

// Set reasonable body size limits
app.use(express.json({ limit: "2mb" })); 
app.use(cookieParser());

// Health check endpoint that doesn't require DB
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "AlumnLink API is healthy" });
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

// Middleware to handle database connection
const withDb = async (req, res, next) => {
  // Skip DB connection for health check
  if (req.path === '/health') {
    return next();
  }

  try {
    // Set a timeout for the DB connection
    const connectionPromise = getDbConnection();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('DB connection timeout')), 3000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({ 
      error: 'Database connection failed', 
      message: 'Service temporarily unavailable' 
    });
  }
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

// For local development
if (process.env.NODE_ENV !== "production") {
  // Connect to DB immediately in development
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Auto-cleanup scheduler initialized');
    });
  });
}

// Export for Vercel serverless deployment
// In production, we export the serverless handler without connecting to DB first
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
