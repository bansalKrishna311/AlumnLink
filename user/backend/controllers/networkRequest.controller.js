import NetworkRequest from "../models/NetworkRequest.model.js";

// Create a new network request
export const createNetworkRequest = async (req, res) => {
  try {
    const { network, name, rollNumber, batch, courseName } = req.body;

    // Validate input
    if (!network || !name || !rollNumber || !batch || !courseName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create and save the request
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
    const requests = await NetworkRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error });
  }
};

// Approve or reject a request
export const updateNetworkRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be 'Approved' or 'Rejected'" });
    }

    const updatedRequest = await NetworkRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to update request status", error });
  }
};
