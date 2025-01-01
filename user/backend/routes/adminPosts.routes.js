import express from 'express';
import { createAdminPost } from '../controllers/adminPost.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Route for creating a post
router.post('/create', protectRoute, upload.single('image'), createAdminPost);

export default router;
