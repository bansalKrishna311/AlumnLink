// POST.CONTROLLER.JS

import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

// Fetch posts for the user's feed
// Modify getFeedPosts to only show approved posts
export const getFeedPosts = async (req, res) => {
    try {
        const userIds = [...req.user.Links, req.user._id];
        const posts = await Post.find({ 
            author: { $in: userIds },
            status: "approved" // Only show approved posts
        })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new post

export const createPost = async (req, res) => {
    try {
        const { content, image, type, jobDetails, internshipDetails, eventDetails, links } = req.body; // Destructure the new field

        console.log("Received data:", { content, image, type, jobDetails, internshipDetails, eventDetails, links });

        let newPostData = {
            author: req.user._id,
            content,
            type,
        };

        // Include details based on post type
        if (type === "job" && jobDetails) {
            newPostData.jobDetails = jobDetails; // Add jobDetails to post data
        } else if (type === "internship" && internshipDetails) {
            newPostData.internshipDetails = internshipDetails; // Add internshipDetails to post data
        } else if (type === "event" && eventDetails) {
            newPostData.eventDetails = eventDetails; // Add eventDetails to post data
        }

        // Include links if provided
        if (Array.isArray(links) && links.length > 0) {
            newPostData.links = links; // Add links to post data
        }

        // Upload image to Cloudinary if provided
        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPostData.image = imgResult.secure_url; // Add image URL to post data
        }

        // Create a new post instance with the correct structure
        const newPost = new Post(newPostData);
        await newPost.save();

        console.log("Post created successfully:", newPost); // Log successful creation
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Delete a post
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the current user is the author of the post
        if (post.author.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this post" });
        }

        // Delete the image from Cloudinary if it exists
        if (post.image) {
            const publicId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error in deletePost controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a post by ID
export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getPostById controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a comment on a post
export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;

        const post = await Post.findByIdAndUpdate(
            postId,
            { $push: { comments: { user: req.user._id, content } } },
            { new: true }
        ).populate("author", "name email username headline profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create a notification if the comment owner is not the post owner
        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId,
            });

            await newNotification.save();

            // Send notification email
            const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
            await sendCommentNotificationEmail(post.author.email, post.author.name, req.user.name, postUrl, content);
        }

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in createComment controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Like or unlike a post
export const likePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.likes.includes(userId)) {
            // Unlike the post
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
            // Like the post
            post.likes.push(userId);
            
            // Create a notification if the post owner is not the user who liked
            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId,
                });

                await newNotification.save();
            }
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error("Error in likePost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};



export const getPendingPosts = async (req, res) => {
    try {
        // Check if user is authorized (admin or super admin)
        const { role } = req.user;
        if (role !== 'admin' && role !== 'super admin') {
            return res.status(403).json({ message: "Not authorized to view pending posts" });
        }

        const posts = await Post.find({ status: "pending" })
            .populate("author", "name username profilePicture headline")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getPendingPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const reviewPost = async (req, res) => {
    try {
        const { status, feedback } = req.body;
        const postId = req.params.id;

        // Check if user is authorized (admin or super admin)
        const { role } = req.user;
        if (role !== 'admin' && role !== 'super admin') {
            return res.status(403).json({ message: "Not authorized to review posts" });
        }

        // Update post status
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                status,
                adminId: req.user._id,
                adminFeedback: feedback,
                reviewedAt: new Date()
            },
            { new: true }
        ).populate("author", "name email");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create notification for post author
        const newNotification = new Notification({
            recipient: post.author._id,
            type: "post_review",
            relatedUser: req.user._id,
            relatedPost: postId,
            content: `Your post has been ${status}${feedback ? `: ${feedback}` : ''}`
        });

        await newNotification.save();

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in reviewPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const createAdminPost = async (req, res) => {
    try {
        const { content, image, type, jobDetails, internshipDetails, eventDetails } = req.body; // Destructure additional details
        console.log("Received data:", { content, image, type, jobDetails, internshipDetails, eventDetails });

        let newPostData = {
            author: req.user._id,
            content,
            type,
        };

        // Include details based on post type
        if (type === "job" && jobDetails) {
            newPostData.jobDetails = jobDetails; // Add jobDetails to post data
        } else if (type === "internship" && internshipDetails) {
            newPostData.internshipDetails = internshipDetails; // Add internshipDetails to post data
        } else if (type === "event" && eventDetails) {
            newPostData.eventDetails = eventDetails; // Add eventDetails to post data
        }

        // Upload image to Cloudinary if provided
        if (image) {
            const imgResult = await cloudinary.uploader.upload(image);
            newPostData.image = imgResult.secure_url; // Add image URL to post data
        }

        // Create a new post instance with the correct structure
        const newPost = new Post(newPostData);
        await newPost.save();

        console.log("Post created successfully:", newPost); // Log successful creation
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

