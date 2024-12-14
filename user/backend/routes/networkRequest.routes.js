import express from "express";
import {
  createNetworkRequest,
  getAllNetworkRequests,
  updateNetworkRequestStatus,
} from "../controllers/networkRequest.controller.js";

const router = express.Router();

// Create a new network request
router.post("/", createNetworkRequest);

// Fetch all network requests
router.get("/", getAllNetworkRequests);

// Update the status of a network request
router.put("/:id/status", updateNetworkRequestStatus);

export default router;
