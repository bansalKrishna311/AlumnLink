import { sendLinkAcceptedEmail } from "../emails/emailHandlers.js";
import LinkRequest from "../models/LinkRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const sendLinkRequest = async (req, res) => {
    try {
        const { userId } = req.params; // Retrieve userId from route params
        const senderId = req.user._id; // Current logged-in user's ID

        // Check if sender is trying to link themselves
        if (senderId.toString() === userId) {
            return res.status(400).json({ message: "You can't send a request to yourself" });
        }

        // Ensure recipientUserId is defined
        const recipientUserId = userId;

        // Check if the user is already linked
        if (req.user.Links.includes(recipientUserId)) {
            return res.status(400).json({ message: "You are already linked" });
        }

        // Check if a pending request already exists
        const existingRequest = await LinkRequest.findOne({
            sender: senderId,
            recipient: recipientUserId,
            status: "pending",
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A link request already exists" });
        }

        // Create new link request with status as "pending"
        const newRequest = new LinkRequest({
            sender: senderId,
            recipient: recipientUserId,
            rollNumber: req.body.rollNumber,
            batch: req.body.batch,
            courseName: req.body.courseName,
            status: "pending", // Set initial status to pending
        });

        await newRequest.save();

        res.status(201).json({
            message: "Link request sent successfully",
            request: {
                ...newRequest.toObject(),
                status: newRequest.status, // Include the status in the response
            },
        });
    } catch (error) {
        console.error("Error in sendLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const acceptLinkRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await LinkRequest.findById(requestId)
            .populate("sender", "name email username location profilePicture headline")
            .populate("recipient", "name username location profilePicture headline");

        if (!request) {
            return res.status(404).json({ message: "Link request not found" });
        }

        if (request.recipient._id.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to accept this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        // Set the status to 'accepted' after all validations
        request.status = "accepted";
        await request.save();

        // Update links for both users
        await User.findByIdAndUpdate(request.sender._id, { $addToSet: { Links: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { Links: request.sender._id } });

        // Send acceptance email
        await sendLinkAcceptedEmail(request.sender.email, req.user.name);

        const notification = new Notification({
            recipient: request.sender._id,
            type: "LinkAccepted",
            relatedUser: userId,
        });

        await notification.save();

        res.json({ message: "Link accepted successfully", request });

    } catch (error) {
        console.error("Error in acceptLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const rejectLinkRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const request = await LinkRequest.findById(requestId);

        if (request.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to reject this request" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "This request has already been processed" });
        }

        request.status = "rejected";
        await request.save();

        res.json({ message: "Link request rejected", request });
    } catch (error) {
        console.error("Error in rejectLinkRequest:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const recipientId = req.user?._id;

        if (!recipientId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Set up pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        // Query with pagination including all relevant fields
        const pendingRequests = await LinkRequest.find({
            status: 'pending',
            recipient: new mongoose.Types.ObjectId(recipientId)
        })
            .select('sender recipient rollNumber batch courseName status createdAt updatedAt')
            .populate('sender', 'name email location') // Assuming User model has these fields
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get total count for pagination
        const totalCount = await LinkRequest.countDocuments({
            status: 'pending',
            recipient: new mongoose.Types.ObjectId(recipientId)
        });

        // Transform the data to include additional computed fields if needed
        const formattedRequests = pendingRequests.map(request => ({
            ...request,
            batchYear: request.batch, // For clarity in frontend
            academicDetails: {
                rollNumber: request.rollNumber,
                courseName: request.courseName,
                batch: request.batch
            }
        }));

        res.status(200).json({
            success: true,
            data: formattedRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalRequests: totalCount,
                hasNextPage: skip + pendingRequests.length < totalCount,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error in getPendingRequests:', {
            userId: req?.user?._id,
            error: error.message
        });

        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching pending requests'
        });
    }
};
export const getUserLinks = async (req, res) => {
    try {
        const userId = req.user._id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Fetch all accepted link requests involving the user
        const linkRequests = await LinkRequest.find({
            $or: [{ sender: userId }, { recipient: userId }],
            status: "accepted",
        })
            .populate("sender", "name username location profilePicture headline")
            .populate("recipient", "name username location profilePicture headline")
            .sort({ createdAt: -1 });

        if (!linkRequests || linkRequests.length === 0) {
            return res.status(404).json({ success: false, message: "No links found" });
        }

        // Transform data
        const transformedLinks = linkRequests
            .filter((request) => request.sender && request.recipient) // Ensure sender and recipient exist
            .map((request) => ({
                _id: request._id,
                connection: request.sender._id.equals(userId) ? "sent" : "received",
                user: request.sender._id.equals(userId) ? request.recipient : request.sender,
                rollNumber: request.rollNumber,
                batch: request.batch,
                courseName: request.courseName,
                status: request.status,
                createdAt: request.createdAt,
                updatedAt: request.updatedAt,
            }));

        if (transformedLinks.length === 0) {
            return res.status(404).json({ success: false, message: "No valid links found" });
        }

        res.json(transformedLinks);
    } catch (error) {
        console.error("Error in getUserLinks controller:", error.message, error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user links",
            error: error.message,
        });
    }
};

export const getRejectedLinks = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all link requests where the user is either the sender or recipient and the status is 'pending'
        const linkRequests = await LinkRequest.find({
            $or: [
                { sender: userId },
                { recipient: userId }
            ],
            status: 'rejected' // Only fetch link requests with status 'pending'
        })
        .populate('sender', 'name username location profilePicture headline')
        .populate('recipient', 'name username location profilePicture headline')
        .sort({ createdAt: -1 }); // Sort by newest first

        // Transform the data to include connection type (sent/received)
        const transformedLinks = linkRequests.map(request => ({
            _id: request._id,
            connection: request.sender._id.equals(userId) ? 'sent' : 'received',
            user: request.sender._id.equals(userId) ? request.recipient : request.sender,
            rollNumber: request.rollNumber,
            batch: request.batch,
            courseName: request.courseName,
            status: request.status,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        }));

        res.json(transformedLinks);
    } catch (error) {
        console.error("Error in getUserLinks controller:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to fetch user links",
            error: error.message 
        });
    }
};
export const removeLink = async (req, res) => {
    try {
        const myId = req.user._id;
        const { userId } = req.params;

        await User.findByIdAndUpdate(myId, { $pull: { Links: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { Links: myId } });

        res.json({ message: "Link removed successfully" });
    } catch (error) {
        console.error("Error in removeLink controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getLinkstatus = async (req, res) => {
    try {
        const targetUserId = req.params.userId;
        const currentUserId = req.user._id;

        const currentUser = req.user;
        if (currentUser.Links.includes(targetUserId)) {
            return res.json({ status: "Linked" });
        }

        const pendingRequest = await LinkRequest.findOne({
            $or: [
                { sender: currentUserId, recipient: targetUserId },
                { sender: targetUserId, recipient: currentUserId },
            ],
            status: "pending",
        });

        if (pendingRequest) {
            if (pendingRequest.sender.toString() === currentUserId.toString()) {
                return res.json({ status: "pending" });
            } else {
                return res.json({ status: "received", requestId: pendingRequest._id });
            }
        }

        // if no Link or pending req found
        res.json({ status: "not_Linked" });
    } catch (error) {
        console.error("Error in getLinkstatus controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const getUsersLinks = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId).populate({
      path: "Links",
      select: "name username profilePicture location skills experience education",
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(user.Links);
  } catch (error) {
    console.error("Error fetching user links:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user links",
      error: error.message,
    });
  }
};

