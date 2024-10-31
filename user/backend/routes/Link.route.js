import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	acceptLinkRequest,
	getLinkRequests,
	getLinkstatus,
	getUserLinks,
	rejectLinkRequest,
	removeLink,
	sendLinkRequest,
} from "../controllers/Link.controller.js";

const router = express.Router();

router.post("/request/:userId", protectRoute, sendLinkRequest);
router.put("/accept/:requestId", protectRoute, acceptLinkRequest);
router.put("/reject/:requestId", protectRoute, rejectLinkRequest);
// Get all Link requests for the current user
router.get("/requests", protectRoute, getLinkRequests);
// Get all Links for a user
router.get("/", protectRoute, getUserLinks);
router.delete("/:userId", protectRoute, removeLink);
router.get("/status/:userId", protectRoute, getLinkstatus);

export default router;
