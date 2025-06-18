import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  updateUserAvailability,
  getUserAvailability,
  getBandMembersAvailability,
  getOptimalRehearsalTimes,
  createRecurringAvailability,
  deleteRecurringAvailability
} from '../controllers/availabilityController';

const router = Router();

// All availability routes require authentication
router.use(authenticate);

// @route   GET /api/availability
// @desc    Get user's availability for a date range
// @access  Private
router.get(
  '/',
  [
    query('start_date').isISO8601().withMessage('Valid start date is required'),
    query('end_date').isISO8601().withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.query.start_date as string)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    validateRequest,
  ],
  getUserAvailability
);

// @route   PUT /api/availability
// @desc    Update user's availability
// @access  Private
router.put(
  '/',
  [
    body('available_periods').isArray().withMessage('available_periods must be an array'),
    body('available_periods.*.start_time').isISO8601().withMessage('Valid start time is required'),
    body('available_periods.*.end_time').isISO8601().withMessage('Valid end time is required')
      .custom((value, { req }) => {
        const index = req.body.available_periods.findIndex((p: any) => p.end_time === value);
        if (new Date(value) <= new Date(req.body.available_periods[index].start_time)) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    body('unavailable_periods').optional().isArray().withMessage('unavailable_periods must be an array'),
    body('unavailable_periods.*.start_time').optional().isISO8601().withMessage('Valid start time is required'),
    body('unavailable_periods.*.end_time').optional().isISO8601().withMessage('Valid end time is required')
      .custom((value, { req }) => {
        const index = req.body.unavailable_periods.findIndex((p: any) => p.end_time === value);
        if (new Date(value) <= new Date(req.body.unavailable_periods[index].start_time)) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    validateRequest,
  ],
  updateUserAvailability
);

// @route   GET /api/availability/band/:bandId
// @desc    Get availability for all band members
// @access  Private
router.get(
  '/band/:bandId',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    query('start_date').isISO8601().withMessage('Valid start date is required'),
    query('end_date').isISO8601().withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.query.start_date as string)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    validateRequest,
  ],
  getBandMembersAvailability
);

// @route   GET /api/availability/optimal-times/:bandId
// @desc    Get optimal rehearsal times based on band members' availability
// @access  Private
router.get(
  '/optimal-times/:bandId',
  [
    param('bandId').isUUID().withMessage('Invalid band ID'),
    query('start_date').isISO8601().withMessage('Valid start date is required'),
    query('end_date').isISO8601().withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.query.start_date as string)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    query('duration_minutes').isInt({ min: 30, max: 480 }).withMessage('Duration must be between 30 and 480 minutes'),
    query('required_members').optional().isArray().withMessage('required_members must be an array'),
    query('required_members.*').optional().isUUID().withMessage('Invalid user ID'),
    query('preferred_days').optional().isArray().withMessage('preferred_days must be an array'),
    query('preferred_days.*').optional().isInt({ min: 0, max: 6 }).withMessage('Day must be between 0 (Sunday) and 6 (Saturday)'),
    validateRequest,
  ],
  getOptimalRehearsalTimes
);

// @route   POST /api/availability/recurring
// @desc    Create recurring availability pattern
// @access  Private
router.post(
  '/recurring',
  [
    body('day_of_week').isInt({ min: 0, max: 6 }).withMessage('Day must be between 0 (Sunday) and 6 (Saturday)'),
    body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in format HH:MM'),
    body('end_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in format HH:MM')
      .custom((value, { req }) => {
        const startParts = req.body.start_time.split(':').map(Number);
        const endParts = value.split(':').map(Number);
        
        const startMinutes = startParts[0] * 60 + startParts[1];
        const endMinutes = endParts[0] * 60 + endParts[1];
        
        if (endMinutes <= startMinutes) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
    body('is_available').isBoolean().withMessage('is_available must be a boolean'),
    body('priority').optional().isInt({ min: 1, max: 10 }).withMessage('Priority must be between 1 and 10'),
    body('notes').optional(),
    validateRequest,
  ],
  createRecurringAvailability
);

// @route   DELETE /api/availability/recurring/:id
// @desc    Delete recurring availability pattern
// @access  Private
router.delete(
  '/recurring/:id',
  [
    param('id').isUUID().withMessage('Invalid recurring availability ID'),
    validateRequest,
  ],
  deleteRecurringAvailability
);

export default router;