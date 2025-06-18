import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createRehearsal,
  getRehearsals,
  getRehearsalById,
  updateRehearsal,
  deleteRehearsal,
  updateAttendanceStatus,
  getRehearsalAttendees,
  suggestRehearsalTimes
} from '../controllers/rehearsalController';

const router = Router();

// All rehearsal routes require authentication
router.use(authenticate);

// @route   GET /api/rehearsals
// @desc    Get rehearsals (filtered by band, date range, etc.)
// @access  Private
router.get(
  '/',
  [
    query('band_id').optional().isUUID().withMessage('Invalid band ID'),
    query('start_date').optional().isISO8601().withMessage('Invalid start date format'),
    query('end_date').optional().isISO8601().withMessage('Invalid end date format'),
    query('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status'),
    validateRequest,
  ],
  getRehearsals
);

// @route   GET /api/rehearsals/:id
// @desc    Get rehearsal by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid rehearsal ID'),
    validateRequest,
  ],
  getRehearsalById
);

// @route   POST /api/rehearsals
// @desc    Create a new rehearsal
// @access  Private
router.post(
  '/',
  [
    body('band_id').isUUID().withMessage('Valid band ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('venue_id').optional().isUUID().withMessage('Invalid venue ID'),
    body('start_time').isISO8601().withMessage('Valid start time is required'),
    body('end_time').isISO8601().withMessage('Valid end time is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.start_time)) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    body('description').optional(),
    body('is_recurring').optional().isBoolean().withMessage('is_recurring must be a boolean'),
    body('recurrence_pattern').optional(),
    body('location_details').optional(),
    body('setlist_ids').optional().isArray().withMessage('setlist_ids must be an array'),
    body('setlist_ids.*').optional().isUUID().withMessage('Invalid setlist ID'),
    body('attendees').optional().isArray().withMessage('attendees must be an array'),
    body('attendees.*.user_id').optional().isUUID().withMessage('Invalid user ID'),
    validateRequest,
  ],
  createRehearsal
);

// @route   PUT /api/rehearsals/:id
// @desc    Update rehearsal
// @access  Private
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid rehearsal ID'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('venue_id').optional().isUUID().withMessage('Invalid venue ID'),
    body('start_time').optional().isISO8601().withMessage('Invalid start time format'),
    body('end_time').optional().isISO8601().withMessage('Invalid end time format'),
    body('description').optional(),
    body('is_recurring').optional().isBoolean().withMessage('is_recurring must be a boolean'),
    body('recurrence_pattern').optional(),
    body('location_details').optional(),
    body('status').optional().isIn(['scheduled', 'completed', 'cancelled']).withMessage('Invalid status'),
    validateRequest,
  ],
  updateRehearsal
);

// @route   DELETE /api/rehearsals/:id
// @desc    Delete rehearsal
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid rehearsal ID'),
    validateRequest,
  ],
  deleteRehearsal
);

// @route   GET /api/rehearsals/:id/attendees
// @desc    Get attendees for a rehearsal
// @access  Private
router.get(
  '/:id/attendees',
  [
    param('id').isUUID().withMessage('Invalid rehearsal ID'),
    validateRequest,
  ],
  getRehearsalAttendees
);

// @route   PUT /api/rehearsals/:id/attendance
// @desc    Update user's attendance status for a rehearsal
// @access  Private
router.put(
  '/:id/attendance',
  [
    param('id').isUUID().withMessage('Invalid rehearsal ID'),
    body('status').isIn(['pending', 'confirmed', 'declined']).withMessage('Invalid attendance status'),
    body('notes').optional(),
    validateRequest,
  ],
  updateAttendanceStatus
);

// @route   GET /api/rehearsals/suggest-times
// @desc    Get suggested rehearsal times based on band member availability
// @access  Private
router.get(
  '/suggest-times',
  [
    query('band_id').isUUID().withMessage('Valid band ID is required'),
    query('duration_minutes').optional().isInt({ min: 30 }).withMessage('Duration must be at least 30 minutes'),
    query('from_date').optional().isISO8601().withMessage('Invalid from date format'),
    query('to_date').optional().isISO8601().withMessage('Invalid to date format'),
    validateRequest,
  ],
  suggestRehearsalTimes
);

export default router;