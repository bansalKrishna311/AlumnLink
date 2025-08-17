import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
    getSuggestedLinks, 
    getPublicProfile, 
    updateProfile, 
    getMentionSuggestions,
    getUserContributionData,
    getMyContributions
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedLinks);
router.get("/mention-suggestions", protectRoute, getMentionSuggestions);
router.get("/contributions/me", protectRoute, getMyContributions);
router.get("/contributions/:username", protectRoute, getUserContributionData);
router.get("/:username", protectRoute, getPublicProfile);

router.put("/profile", protectRoute, updateProfile);

export default router;
