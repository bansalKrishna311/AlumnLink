import express from 'express';
import { body, param, query } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  addNote,
  updateStatus,
  setFollowUp,
  archiveLead,
  getLeadStats,
  getFollowUpLeads,
  bulkUpdateLeads
} from '../controllers/lead.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation rules
const createLeadValidation = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be between 1-50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be between 1-50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('company')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
  body('jobTitle')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Job title must be less than 100 characters'),
  body('leadSource')
    .isIn(['Website', 'Social Media', 'Email Campaign', 'Referral', 'Cold Call', 'Event', 'Partnership', 'Organic Search', 'Paid Ads', 'Other'])
    .withMessage('Invalid lead source'),
  body('leadType')
    .isIn(['Institute', 'Corporate', 'School', 'Individual', 'Partnership', 'Vendor'])
    .withMessage('Invalid lead type'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority level'),
  body('estimatedValue')
    .optional()
    .isNumeric()
    .withMessage('Estimated value must be a number'),
  body('requirements')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Requirements must be less than 1000 characters')
];

const updateLeadValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1-50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1-50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('phone')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Phone number must be less than 20 characters'),
  body('leadSource')
    .optional()
    .isIn(['Website', 'Social Media', 'Email Campaign', 'Referral', 'Cold Call', 'Event', 'Partnership', 'Organic Search', 'Paid Ads', 'Other'])
    .withMessage('Invalid lead source'),
  body('leadType')
    .optional()
    .isIn(['Institute', 'Corporate', 'School', 'Individual', 'Partnership', 'Vendor'])
    .withMessage('Invalid lead type'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority level')
];

const addNoteValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Note content is required and must be between 1-500 characters'),
  body('type')
    .optional()
    .isIn(['Note', 'Call', 'Email', 'Meeting', 'Follow-up'])
    .withMessage('Invalid note type')
];

const updateStatusValidation = [
  body('status')
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Nurturing'])
    .withMessage('Invalid status'),
  body('lostReason')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Lost reason must be less than 200 characters')
];

const paramValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid lead ID')
];

// Apply auth middleware to all routes
router.use(protectRoute);

// Lead CRUD routes
router.get('/', getLeads);
router.get('/stats', getLeadStats);
router.get('/follow-up', getFollowUpLeads);
router.get('/:id', paramValidation, getLeadById);
router.post('/', createLeadValidation, createLead);
router.put('/:id', paramValidation, updateLeadValidation, updateLead);
router.delete('/:id', paramValidation, archiveLead);

// Lead action routes
router.post('/:id/notes', paramValidation, addNoteValidation, addNote);
router.put('/:id/status', paramValidation, updateStatusValidation, updateStatus);
router.put('/:id/follow-up', paramValidation, [
  body('nextFollowUp')
    .isISO8601()
    .withMessage('Valid follow-up date is required')
], setFollowUp);

// Bulk operations
router.put('/bulk/update', [
  body('leadIds')
    .isArray({ min: 1 })
    .withMessage('Lead IDs array is required'),
  body('leadIds.*')
    .isMongoId()
    .withMessage('Invalid lead ID in array'),
  body('updates')
    .isObject()
    .withMessage('Updates object is required')
], bulkUpdateLeads);

export default router;
