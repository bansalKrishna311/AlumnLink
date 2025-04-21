import express from 'express';
import { getInstitutes, getCorporate, getSchools } from '../controllers/admin.controller.js';
import { getRejectedPosts } from '../controllers/post.controller.js';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/institutes', getInstitutes);
router.get('/schools', getSchools);
router.get('/Corporates', getCorporate);
router.get('/rejected-posts', protectRoute, isAdmin, getRejectedPosts);

export default router;
