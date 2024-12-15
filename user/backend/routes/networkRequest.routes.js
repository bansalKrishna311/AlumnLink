import express from "express";
import {
  createNetworkRequest,
  getAllNetworkRequests,
  updateNetworkRequestStatus,
  deleteNetworkRequest,
} from "../controllers/networkRequest.controller.js";

const router = express.Router();

router.post("/", createNetworkRequest);
router.get("/", getAllNetworkRequests);
router.patch("/:id", updateNetworkRequestStatus); // Update status
router.delete("/:id", deleteNetworkRequest);

export default router;
