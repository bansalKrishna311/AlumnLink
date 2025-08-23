import express from "express";
import { login, logout, signup, getCurrentUser,requestPasswordReset, resetPassword, linkedInCallback, initiateLinkedInAuth, debugLinkedInConfig } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";



const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.get("/linkedin", initiateLinkedInAuth);
router.get("/linkedinCallback", linkedInCallback);
router.get("/linkedin-debug", debugLinkedInConfig);

// kerg
router.get("/me", protectRoute, getCurrentUser);

export default router;
