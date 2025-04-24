import express from "express";
import { protectRoute, isSuperAdmin } from "../middleware/auth.middleware.js";
import {
  createContactSubmission,
  getContactSubmissions,
  respondToContact
} from "../controllers/contact.controller.js";

const router = express.Router();

// Public route for creating contact submissions
router.post("/submit", createContactSubmission);

// Protected routes for admins/superadmins
router.get("/", protectRoute, isSuperAdmin, getContactSubmissions);
router.put("/:contactId/respond", protectRoute, isSuperAdmin, respondToContact);

export default router;