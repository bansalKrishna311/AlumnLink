import express from "express";
import { protectRoute, isAdmin } from "../middleware/auth.middleware.js";
import {
    createPost,
    getFeedPosts,
    deletePost,
    getPostById,
    createComment,
    reactToPost,
    getPendingPosts,
    reviewPost,
    createAdminPost,
    updatePostStatus,
    replyToComment,
    likeComment,
    likeReply,
    bookmarkPost,
    getBookmarkedPosts,
    getPostsByUsername,
    getRecentAdminPosts,
} from "../controllers/post.controller.js";
import Post from "../models/post.model.js"; // Added import for Post model

const router = express.Router();

import multer from 'multer';    
const upload = multer({ dest: 'uploads/' });

// Getting posts
router.get("/", protectRoute, getFeedPosts);
router.get("/bookmarked", protectRoute, getBookmarkedPosts);
router.get("/user/:username", protectRoute, getPostsByUsername);
router.get("/:id", protectRoute, getPostById);

// Creating posts
router.post("/create", protectRoute, createPost);
router.post("/createAdminPost", protectRoute, createAdminPost);

// Deleting posts
router.delete("/delete/:id", protectRoute, deletePost);

// Comments and replies
router.post("/:id/comment", protectRoute, createComment);
router.post("/:postId/comment/:commentId/reply", protectRoute, replyToComment);
router.post("/:postId/comment/:commentId/like", protectRoute, likeComment);
router.post("/:postId/comment/:commentId/reply/:replyId/like", protectRoute, likeReply);

// Reactions and bookmarks
router.post("/:id/react", protectRoute, reactToPost);
router.post("/:id/bookmark", protectRoute, bookmarkPost);

// Hashtag routes
router.get("/hashtag/:tag", protectRoute, async (req, res) => {
    try {
        const { tag } = req.params;
        const posts = await Post.findByHashtag(tag)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture username headline")
            .populate("reactions.user", "name username profilePicture headline")
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching hashtag posts:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Admin routes
router.get("/admin/pending", protectRoute, isAdmin, getPendingPosts);
router.post("/admin/:id/review", protectRoute, isAdmin, reviewPost);
router.patch('/admin/:postId/status', protectRoute, isAdmin, updatePostStatus);
router.post('/admin/create', protectRoute, upload.single('image'), createAdminPost);
router.get('/admin/recent', protectRoute, isAdmin, getRecentAdminPosts);

export default router;
