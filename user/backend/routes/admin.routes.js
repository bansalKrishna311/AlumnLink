
import express from 'express';
import { getInstitutes,getCorporate, getSchools} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/institutes', getInstitutes);
router.get('/schools', getSchools);
router.get('/Corporates', getCorporate);


export default router;
