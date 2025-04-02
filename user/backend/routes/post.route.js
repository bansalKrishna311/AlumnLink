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
} from "../controllers/post.controller.js";

const router = express.Router();



import multer from 'multer';    
const upload = multer({ dest: 'uploads/' });

router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.post("/createAdminPost", protectRoute, createAdminPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.post("/:id/comment", protectRoute, createComment);
// router.post("/:id/like", protectRoute, likePost);

// New admin routes
router.get("/admin/pending", protectRoute, isAdmin, getPendingPosts);
router.post("/admin/:id/review", protectRoute, isAdmin, reviewPost);

router.patch('/admin/:postId/status', updatePostStatus);


router.post("/:id/react", protectRoute, reactToPost);  

router.post('/admin/create', protectRoute, upload.single('image'), createAdminPost);


export default router;
