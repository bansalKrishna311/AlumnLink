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

import connectDB from "./lib/db.js"; // Correct the import

dotenv.config();

// For quick response in serverless environment
let isConnected = false;
let connectionPromise = null;

// Modified connect function with timeout
const connectToDatabase = async () => {
  if (isConnected) {
    return Promise.resolve();
  }
  
  if (!connectionPromise) {
    connectionPromise = connectDB()
      .then(() => {
        isConnected = true;
        console.log('MongoDB Connected successfully');
      })
      .catch(err => {
        connectionPromise = null;
        console.error('MongoDB connection error:', err);
        throw err;
      });
  }
  
  return connectionPromise;
};

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Optimized maintenance tasks function
const runMaintenanceTasks = async () => {
  // Only run on 1% of requests to minimize impact
  if (Math.random() < 0.01) {
    // Use a timeout to ensure the main request doesn't wait for this
    setTimeout(async () => {
      try {
        await Promise.all([
          cleanupOldLinkRequests(),
          notifyExpiringRequests()
        ]);
        console.log('Maintenance tasks completed');
      } catch (err) {
        console.error('Error in maintenance tasks:', err);
      }
    }, 100);
  }
};

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
  
app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

// Connect to DB middleware - ensures connection before handling requests
app.use(async (req, res, next) => {
  try {
    // Use a timeout promise to ensure we don't hang
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('DB connection timeout')), 5000);
    });
    
    await Promise.race([connectToDatabase(), timeoutPromise]);
    
    // Only trigger maintenance on non-critical paths
    if (!req.path.includes('/auth') && !req.path.includes('/users') && req.method === 'GET') {
      runMaintenanceTasks();
    }
    
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    res.status(500).send('Server Error: Database connection failed');
  }
});

// Health check endpoint - responds immediately
app.get("/", (req, res) => {
  res.send("AlumnLink API is running");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifySession, userRoutes);
app.use("/api/v1/posts", verifySession, postRoutes);
app.use("/api/v1/notifications", verifySession, notificationRoutes);
app.use("/api/v1/Links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);
app.use('/api/v1/messages', verifySession, messageRoutes);

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Auto-cleanup scheduler initialized for old link requests');
  });
}

// Export for Vercel serverless deployment
export default process.env.NODE_ENV === "production"
  ? serverless(app)
  : app;
