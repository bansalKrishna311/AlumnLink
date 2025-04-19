import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	deleteNotification,
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);

router.put("/:id/read", protectRoute, markNotificationAsRead);
router.put("/mark-all-read", protectRoute, markAllNotificationsAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
