import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	acceptLinkRequest,

	getLinkstatus,
	getPendingRequests,
	getUserLinks,
	rejectLinkRequest,
	removeLink,
	sendLinkRequest,
	updateLinkRequestStatus,
} from "../controllers/Link.controller.js";

const router = express.Router();

// Route to send a Link request with additional fields (like name, rollNumber, etc.)
router.post("/request/:userId", protectRoute, sendLinkRequest);

// Route to accept a Link request
router.put("/accept/:requestId", protectRoute, acceptLinkRequest);

// Route to reject a Link request
router.put("/reject/:requestId", protectRoute, rejectLinkRequest);

// Route to fetch all pending Link requests for the current user
router.get("/link-requests", protectRoute, getPendingRequests );


// Route to fetch all accepted Links for the current user
router.get("/", protectRoute, getUserLinks);

// Route to remove an existing Link
router.delete("/:userId", protectRoute, removeLink);

// Route to fetch the current Link status with a specific user
router.get("/status/:userId", protectRoute, getLinkstatus);


router.patch("/link-requests/:id", updateLinkRequestStatus);

export default router;
