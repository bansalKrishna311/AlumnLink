import { sendLinkAcceptedEmail } from "../emails/emailHandlers.js";
import LinkRequest from "../models/LinkRequest.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const sendLinkRequest = async (req, res) => {
	try {
		const { userId } = req.params;
		const senderId = req.user._id;

		if (senderId.toString() === userId) {
			return res.status(400).json({ message: "You can't send a request to yourself" });
		}

		if (req.user.Links.includes(userId)) {
			return res.status(400).json({ message: "You are already Linked" });
		}

		const existingRequest = await LinkRequest.findOne({
			sender: senderId,
			recipient: userId,
			status: "pending",
		});

		if (existingRequest) {
			return res.status(400).json({ message: "A Link request already exists" });
		}

		const newRequest = new LinkRequest({
			sender: senderId,
			recipient: userId,
		});

		await newRequest.save();

		res.status(201).json({ message: "Link request sent successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const acceptLinkRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const userId = req.user._id;

		const request = await LinkRequest.findById(requestId)
			.populate("sender", "name email username")
			.populate("recipient", "name username");

		if (!request) {
			return res.status(404).json({ message: "Link request not found" });
		}

		// check if the req is for the current user
		if (request.recipient._id.toString() !== userId.toString()) {
			return res.status(403).json({ message: "Not authorized to accept this request" });
		}

		if (request.status !== "pending") {
			return res.status(400).json({ message: "This request has already been processed" });
		}

		request.status = "accepted";
		await request.save();

		// if im your friend then ur also my friend ;)
		await User.findByIdAndUpdate(request.sender._id, { $addToSet: { Links: userId } });
		await User.findByIdAndUpdate(userId, { $addToSet: { Links: request.sender._id } });

		const notification = new Notification({
			recipient: request.sender._id,
			type: "LinkAccepted",
			relatedUser: userId,
		});

		await notification.save();

		res.json({ message: "Link accepted successfully" });

		const senderEmail = request.sender.email;
		const senderName = request.sender.name;
		const recipientName = request.recipient.name;
		const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username;

		try {
			await sendLinkAcceptedEmail(senderEmail, senderName, recipientName, profileUrl);
		} catch (error) {
			console.error("Error in sendLinkAcceptedEmail:", error);
		}
	} catch (error) {
		console.error("Error in acceptLinkRequest controller:", error);
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

		res.json({ message: "Link request rejected" });
	} catch (error) {
		console.error("Error in rejectLinkRequest controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getLinkRequests = async (req, res) => {
	try {
		const userId = req.user._id;

		const requests = await LinkRequest.find({ recipient: userId, status: "pending" }).populate(
			"sender",
			"name username profilePicture headline Links"
		);

		res.json(requests);
	} catch (error) {
		console.error("Error in getLinkRequests controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getUserLinks = async (req, res) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).populate(
			"Links",
			"name username profilePicture headline Links"
		);

		res.json(user.Links);
	} catch (error) {
		console.error("Error in getUserLinks controller:", error);
		res.status(500).json({ message: "Server error" });
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
