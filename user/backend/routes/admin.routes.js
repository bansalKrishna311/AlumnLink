import express from 'express';
import { getInstitutes, getCorporate, getSchools, getAdminCourses, updateAdminCourses, updateAdmin, getAdminById } from '../controllers/admin.controller.js';
import { getRejectedPosts } from '../controllers/post.controller.js';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/institutes', getInstitutes);
router.get('/schools', getSchools);
router.get('/Corporates', getCorporate);
router.get('/corporates', getCorporate); // Add lowercase route for consistency
router.get('/rejected-posts', protectRoute, isAdmin, getRejectedPosts);
router.get('/admin/:adminId/courses', getAdminCourses);
router.put('/admin/:adminId/courses', updateAdminCourses);
router.get('/admin/:adminId', getAdminById);
router.put('/admin/:adminId', updateAdmin);

export default router;
