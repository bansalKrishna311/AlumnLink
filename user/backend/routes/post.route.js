import express from "express";
import { protectRoute, isAdmin, isAdminOrSubAdmin } from "../middleware/auth.middleware.js";
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
    getRejectedPosts,
    deleteComment,
    deleteReply,
} from "../controllers/post.controller.js";
import Post from "../models/post.model.js"; // Added import for Post model

const router = express.Router();

import multer from 'multer';    
// Use memory storage with increased limits for image uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, // Increased to 25MB per file
        fieldSize: 25 * 1024 * 1024, // 25MB for form fields (base64 images)
        files: 5, // Maximum 5 files
        fields: 20 // Maximum 20 form fields
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Getting posts
router.get("/", protectRoute, getFeedPosts);
router.get("/bookmarked", protectRoute, getBookmarkedPosts);
router.get("/user/:username", protectRoute, getPostsByUsername);
router.get("/:id", protectRoute, getPostById);

// Creating posts with error handling for file uploads
router.post("/create", protectRoute, (req, res, next) => {
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ 
                    message: "File too large. Maximum file size is 25MB per image.",
                    maxSize: "25MB"
                });
            }
            if (err.code === 'LIMIT_FIELD_VALUE') {
                return res.status(413).json({ 
                    message: "Request body too large. Maximum size is 25MB.",
                    maxSize: "25MB"
                });
            }
            if (err.message === 'Only image files are allowed!') {
                return res.status(400).json({ 
                    message: "Only image files are allowed. Supported formats: JPG, PNG, GIF, WebP",
                    supportedFormats: ["jpg", "jpeg", "png", "gif", "webp"]
                });
            }
            return res.status(400).json({ 
                message: "File upload error", 
                error: err.message 
            });
        }
        next();
    });
}, createPost);

// Deleting posts
router.delete("/delete/:id", protectRoute, deletePost);

// Comments and replies
router.post("/:id/comment", protectRoute, createComment);
router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);
router.post("/:postId/comment/:commentId/reply", protectRoute, replyToComment);
router.delete("/:postId/comment/:commentId/reply/:replyId", protectRoute, deleteReply);
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
router.get("/admin/pending", protectRoute, isAdminOrSubAdmin, getPendingPosts);
router.get("/admin/rejected", protectRoute, isAdminOrSubAdmin, getRejectedPosts);
router.post("/admin/:id/review", protectRoute, isAdminOrSubAdmin, reviewPost);
router.post("/admin/:postId/review", protectRoute, isAdminOrSubAdmin, reviewPost); // Support both parameter names
router.patch('/admin/:postId/status', protectRoute, isAdminOrSubAdmin, updatePostStatus);
router.post('/admin/create', protectRoute, isAdminOrSubAdmin, (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(413).json({ 
                    message: "File too large. Maximum file size is 25MB.",
                    maxSize: "25MB"
                });
            }
            if (err.message === 'Only image files are allowed!') {
                return res.status(400).json({ 
                    message: "Only image files are allowed. Supported formats: JPG, PNG, GIF, WebP",
                    supportedFormats: ["jpg", "jpeg", "png", "gif", "webp"]
                });
            }
            return res.status(400).json({ 
                message: "File upload error", 
                error: err.message 
            });
        }
        next();
    });
}, createAdminPost);
router.get('/admin/recent', protectRoute, isAdminOrSubAdmin, getRecentAdminPosts);

export default router;
