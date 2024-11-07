// routes/instituteRoutes.js
import express from 'express';
import { getInstitutes } from '../controllers/institute.controller.js';

const router = express.Router();

router.get('/institutes', getInstitutes);

export default router;
