import express from "express";
import mongoose from 'mongoose';
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	acceptLinkRequest,
	getLinkstatus,
	getPendingRequests,
	getRejectedLinks,
	getUserLinks,
	getUsersLinks,
	rejectLinkRequest,
	removeLink,
	resetToPending,
	sendLinkRequest,
	getDashboardStats,
	getSubAdminDashboardStats,
	getSubAdminPendingRequests,
	getSubAdminRejectedRequests,
	getSubAdminManagedAlumni,
	approveHierarchyUpgrade,
	getHierarchyRequests,
	getAvailableHierarchies,
	fixAdminHierarchies,
	getCurrentUserHierarchy
} from "../controllers/Link.controller.js";
import User from '../models/user.model.js';
const router = express.Router();

// Dashboard route
router.get("/dashboard-stats", protectRoute, getDashboardStats);
router.get("/subadmin/dashboard-stats", protectRoute, getSubAdminDashboardStats);

// Hierarchy management routes
router.put("/hierarchy/approve/:linkRequestId", protectRoute, approveHierarchyUpgrade);
router.get("/hierarchy/requests", protectRoute, getHierarchyRequests);
router.get("/hierarchy/available", protectRoute, getAvailableHierarchies);
router.get("/hierarchy/my-hierarchy", protectRoute, getCurrentUserHierarchy);
router.post("/hierarchy/fix-admin-hierarchies", protectRoute, fixAdminHierarchies);

// Route to send a Link request with additional fields (like name, rollNumber, etc.)
router.post("/request/:userId", protectRoute, sendLinkRequest);

// Route to accept a Link request
router.put("/accept/:requestId", protectRoute, acceptLinkRequest);

// Route to reject a Link request
router.put("/reject/:requestId", protectRoute, rejectLinkRequest);

// Route to fetch all pending Link requests for the current user
router.get("/link-requests", protectRoute, getPendingRequests );
router.get("/subadmin/link-requests", protectRoute, getSubAdminPendingRequests);

// Route to fetch all rejected Link requests
router.get("/rejected", protectRoute, getRejectedLinks);
router.get("/subadmin/rejected", protectRoute, getSubAdminRejectedRequests);

// Route to fetch managed alumni for SubAdmin
router.get("/subadmin/managed-alumni", protectRoute, getSubAdminManagedAlumni);

router.get("/", protectRoute, getUserLinks);
// Route to remove an existing Link
router.delete("/:userId", protectRoute, removeLink);

// Route to fetch the current Link status with a specific user
router.get("/status/:userId", protectRoute, getLinkstatus);

// Route to reset a link request to pending status (admin only)
router.put("/reset-to-pending/:requestId", protectRoute, resetToPending);

// router.patch("/link-requests/:id", updateLinkRequestStatus);

// Link.route.js
router.get("/:userId", protectRoute, getUsersLinks);
  
  

export default router;