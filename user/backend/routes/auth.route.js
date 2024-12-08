import express from "express";
import { login, logout, signup, getCurrentUser,requestPasswordReset, resetPassword, approveUser, getPendingUsers} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";



const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);
router.get("/me", protectRoute, getCurrentUser);
router.patch("/approve/:userId", protectRoute,  approveUser);
router.get("/pending-requests", protectRoute, getPendingUsers);


export default router;
