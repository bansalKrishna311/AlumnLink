// main server file
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
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
console.log("Mongo URI:", process.env.MONGO_URI);


// Connect to MongoDB before setting up the server
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Schedule cleanup and notification tasks to run daily at midnight
const scheduleCleanupTasks = () => {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
    );
    const timeToMidnight = night.getTime() - now.getTime();

    // First cleanup at next midnight
    setTimeout(() => {
        Promise.all([
            cleanupOldLinkRequests(),
            notifyExpiringRequests()
        ]).catch(err => console.error('Error in scheduled tasks:', err));

        // Then setup daily interval
        setInterval(() => {
            Promise.all([
                cleanupOldLinkRequests(),
                notifyExpiringRequests()
            ]).catch(err => console.error('Error in scheduled tasks:', err));
        }, 24 * 60 * 60 * 1000);
    }, timeToMidnight);
};

// Start the cleanup schedule
scheduleCleanupTasks();

// Configure CORS for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from any origin in development
    const allowedOrigins = [
      'http://localhost:5173',  // Vite default dev server
      'http://localhost:3000',  // Common React dev server
        'https://alumn-link-rcj5.vercel.app/', // Production URL
    ];
    
    // In development, allow requests with no origin or from any origin
    if (process.env.NODE_ENV !== "production") {
      callback(null, true);
    } 
    // In production, check against allowed origins
    else if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true, // Important for cookies/auth to work cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Apply CORS configuration
app.use(cors(corsOptions));
	
app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifySession, userRoutes);
app.use("/api/v1/posts", verifySession, postRoutes);
app.use("/api/v1/notifications", verifySession, notificationRoutes);
app.use("/api/v1/Links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);
app.use('/api/v1/messages', verifySession, messageRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
	console.log('Auto-cleanup scheduler initialized for old link requests');
});
