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
} from "../controllers/post.controller.js";

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

// Admin routes
router.get("/admin/pending", protectRoute, isAdmin, getPendingPosts);
router.post("/admin/:id/review", protectRoute, isAdmin, reviewPost);
router.patch('/admin/:postId/status', protectRoute, isAdmin, updatePostStatus);
router.post('/admin/create', protectRoute, upload.single('image'), createAdminPost);

export default router;
