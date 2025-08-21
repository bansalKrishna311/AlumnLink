import express from 'express';
import { getInstitutes, getCorporate, getSchools, getAdminCourses, updateAdminCourses } from '../controllers/admin.controller.js';
import { getRejectedPosts } from '../controllers/post.controller.js';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/institutes', getInstitutes);
router.get('/schools', getSchools);
router.get('/Corporates', getCorporate);
router.get('/rejected-posts', protectRoute, isAdmin, getRejectedPosts);
router.get('/admin/:adminId/courses', getAdminCourses);
router.put('/admin/:adminId/courses', updateAdminCourses);

export default router;
