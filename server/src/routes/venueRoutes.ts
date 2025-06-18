import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue
} from '../controllers/venueController';

const router = Router();

// All venue routes require authentication
router.use(authenticate);

// @route   GET /api/venues
// @desc    Get venues (filtered by various criteria)
// @access  Private
router.get(
  '/',
  [
    query('search').optional().isString(),
    query('city').optional().isString(),
    query('state').optional().isString(),
    query('country').optional().isString(),
    query('has_pa').optional().isBoolean(),
    query('has_backline').optional().isBoolean(),
    validateRequest,
  ],
  getVenues
);

// @route   GET /api/venues/:id
// @desc    Get venue by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid venue ID'),
    validateRequest,
  ],
  getVenueById
);

// @route   POST /api/venues
// @desc    Create a new venue
// @access  Private
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Venue name is required'),
    body('address').optional(),
    body('city').optional(),
    body('state').optional(),
    body('country').optional(),
    body('postal_code').optional(),
    body('contact_email').optional().isEmail().withMessage('Invalid email format'),
    body('contact_phone').optional(),
    body('website').optional().isURL().withMessage('Invalid URL format'),
    body('has_pa').optional().isBoolean(),
    body('has_backline').optional().isBoolean(),
    body('notes').optional(),
    body('hourly_rate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
    body('user_id').optional().isUUID().withMessage('Invalid user ID'),
    validateRequest,
  ],
  createVenue
);

// @route   PUT /api/venues/:id
// @desc    Update venue
// @access  Private
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid venue ID'),
    body('name').optional().notEmpty().withMessage('Venue name cannot be empty'),
    body('address').optional(),
    body('city').optional(),
    body('state').optional(),
    body('country').optional(),
    body('postal_code').optional(),
    body('contact_email').optional().isEmail().withMessage('Invalid email format'),
    body('contact_phone').optional(),
    body('website').optional().isURL().withMessage('Invalid URL format'),
    body('has_pa').optional().isBoolean(),
    body('has_backline').optional().isBoolean(),
    body('notes').optional(),
    body('hourly_rate').optional().isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
    validateRequest,
  ],
  updateVenue
);

// @route   DELETE /api/venues/:id
// @desc    Delete venue
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid venue ID'),
    validateRequest,
  ],
  deleteVenue
);

export default router;