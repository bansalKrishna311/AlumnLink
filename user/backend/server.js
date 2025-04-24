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

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// In serverless environment, we can't use traditional scheduling
// This function will be triggered on API calls instead
const runMaintenanceTasks = async () => {
  // Only run maintenance tasks occasionally (e.g., 5% of requests)
  // to avoid overloading the system
  if (Math.random() < 0.05) {
    try {
      await Promise.all([
        cleanupOldLinkRequests(),
        notifyExpiringRequests()
      ]);
      console.log('Maintenance tasks completed');
    } catch (err) {
      console.error('Error in maintenance tasks:', err);
    }
  }
};

// Middleware to trigger maintenance tasks on some requests
app.use(async (req, res, next) => {
  // Don't await this - let it run in the background
  runMaintenanceTasks();
  next();
});

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
