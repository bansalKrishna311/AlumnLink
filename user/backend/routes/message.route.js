import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { sendMessage, getConversation, getConversations, markMessagesAsRead } from "../controllers/message.controller.js";

const router = express.Router();

// All routes in this file require authentication
router.use(protectRoute);

// Send a message
router.post("/send", sendMessage);

// Get conversations list
router.get("/conversations", getConversations);

// Get conversation with a specific user
router.get("/:username", getConversation);

// Mark messages as read
router.patch("/:username/read", markMessagesAsRead);

export default router;