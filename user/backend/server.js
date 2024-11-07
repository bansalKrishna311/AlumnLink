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
import { verifySession } from "./middleware/auth.middleware.js";
import adminRoutes from "./routes/admin.routes.js";

import connectDB from "./lib/db.js"; // Correct the import

dotenv.config();

// Connect to MongoDB before setting up the server
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
		})
	);
}

app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", verifySession, userRoutes);
app.use("/api/v1/posts", verifySession, postRoutes);
app.use("/api/v1/notifications", verifySession, notificationRoutes);
app.use("/api/v1/Links", verifySession, LinkRoutes);
app.use('/api/v1/admin', verifySession, adminRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
