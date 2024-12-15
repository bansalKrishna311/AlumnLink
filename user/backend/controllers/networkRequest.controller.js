import NetworkRequest from "../models/NetworkRequest.model.js";
import mongoose from "mongoose";

// Create a new network request
export const createNetworkRequest = async (req, res) => {
  try {
    const { network, name, rollNumber, batch, courseName } = req.body;

    if (!mongoose.Types.ObjectId.isValid(network)) {
      return res.status(400).json({ message: "Invalid network ID" });
    }

    const newRequest = new NetworkRequest({
      network,
      name,
      rollNumber,
      batch,
      courseName,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit request", error });
  }
};

// Get all network requests (for admin purposes)
export const getAllNetworkRequests = async (req, res) => {
  try {
    const requests = await NetworkRequest.find().populate("network", "name type");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
};

// Approve or reject a network request
export const updateNetworkRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRequest = await NetworkRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: `Request ${status} successfully`, updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request status", error });
  }
};

// Delete a network request
export const deleteNetworkRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await NetworkRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request deleted successfully", deletedRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete request", error });
  }
};
