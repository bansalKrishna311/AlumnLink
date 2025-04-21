// message.controller.js

import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Helper function to check if user is a superadmin
const checkSuperadminAccess = (req, res) => {
    if (req.user.role === 'superadmin') {
        return res.status(403).json({ 
            message: "Messaging is not available for superadmin accounts" 
        });
    }
    return null; // Continue if not superadmin
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        // Check if user is superadmin
        const superadminCheck = checkSuperadminAccess(req, res);
        if (superadminCheck) return superadminCheck;

        const { recipientUsername, content } = req.body;
        
        if (!recipientUsername || !content) {
            return res.status(400).json({ message: "Recipient and message content are required" });
        }

        // Find recipient by username
        const recipient = await User.findOne({ username: recipientUsername });
        
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // Create and save the message
        const newMessage = new Message({
            sender: req.user._id,
            recipient: recipient._id,
            content,
        });

        await newMessage.save();

        // Return the message with populated sender and recipient
        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name username profilePicture")
            .populate("recipient", "name username profilePicture");

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get conversation with another user
export const getConversation = async (req, res) => {
    try {
        // Check if user is superadmin
        const superadminCheck = checkSuperadminAccess(req, res);
        if (superadminCheck) return superadminCheck;

        const { username } = req.params;
        
        // Find the other user by username
        const otherUser = await User.findOne({ username });
        
        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find messages between the current user and the other user
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: otherUser._id },
                { sender: otherUser._id, recipient: req.user._id }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "name username profilePicture")
        .populate("recipient", "name username profilePicture");

        res.status(200).json({ messages, otherUser });
    } catch (error) {
        console.error("Error in getConversation controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all conversations for the current user
export const getConversations = async (req, res) => {
    try {
        // Check if user is superadmin
        const superadminCheck = checkSuperadminAccess(req, res);
        if (superadminCheck) return superadminCheck;

        // Get all messages where the current user is either sender or recipient
        const messages = await Message.find({
            $or: [
                { sender: req.user._id },
                { recipient: req.user._id }
            ]
        })
        .sort({ createdAt: -1 })
        .populate("sender", "name username profilePicture")
        .populate("recipient", "name username profilePicture");

        // Extract unique conversations
        const conversationsMap = {};
        
        messages.forEach(message => {
            const otherUserId = message.sender._id.toString() === req.user._id.toString() 
                ? message.recipient._id.toString() 
                : message.sender._id.toString();
            
            if (!conversationsMap[otherUserId]) {
                const otherUser = message.sender._id.toString() === req.user._id.toString() 
                    ? message.recipient 
                    : message.sender;
                
                conversationsMap[otherUserId] = {
                    user: otherUser,
                    lastMessage: message,
                    unreadCount: message.recipient._id.toString() === req.user._id.toString() && !message.read ? 1 : 0
                };
            } else if (message.recipient._id.toString() === req.user._id.toString() && !message.read) {
                conversationsMap[otherUserId].unreadCount += 1;
            }
        });

        // Convert to array and sort by most recent message
        const conversations = Object.values(conversationsMap);
        conversations.sort((a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt);

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getConversations controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    try {
        // Check if user is superadmin
        const superadminCheck = checkSuperadminAccess(req, res);
        if (superadminCheck) return superadminCheck;
        
        const { username } = req.params;
        
        // Find the other user by username
        const otherUser = await User.findOne({ username });
        
        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update all unread messages from the other user to the current user
        const result = await Message.updateMany(
            { 
                sender: otherUser._id, 
                recipient: req.user._id,
                read: false
            },
            { read: true }
        );

        res.status(200).json({ 
            message: "Messages marked as read",
            count: result.modifiedCount
        });
    } catch (error) {
        console.error("Error in markMessagesAsRead controller:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};