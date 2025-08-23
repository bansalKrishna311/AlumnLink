import express from "express";
import { login, logout, signup, getCurrentUser,requestPasswordReset, resetPassword, linkedInCallback, initiateLinkedInAuth, debugLinkedInConfig } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  validateSignup, 
  validateLogin, 
  validatePasswordReset, 
  validatePasswordResetConfirm 
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.post("/forgot-password", validatePasswordReset, requestPasswordReset);
router.post("/reset-password/:token", validatePasswordResetConfirm, resetPassword);
router.get("/linkedin", initiateLinkedInAuth);
router.get("/linkedinCallback", linkedInCallback);
router.get("/linkedin-debug", debugLinkedInConfig);

// Protected route
router.get("/me", protectRoute, getCurrentUser);

export default router;
