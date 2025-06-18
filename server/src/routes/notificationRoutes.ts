import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  updateNotificationPreferences
} from '../controllers/notificationController';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get(
  '/',
  [
    query('unread_only').optional().isBoolean().withMessage('unread_only must be a boolean'),
    query('type').optional().isString(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a positive integer'),
    validateRequest,
  ],
  getNotifications
);

// @route   GET /api/notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid notification ID'),
    validateRequest,
  ],
  getNotificationById
);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put(
  '/:id/read',
  [
    param('id').isUUID().withMessage('Invalid notification ID'),
    validateRequest,
  ],
  markNotificationAsRead
);

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', markAllNotificationsAsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid notification ID'),
    validateRequest,
  ],
  deleteNotification
);

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', deleteAllNotifications);

// @route   PUT /api/notifications/preferences
// @desc    Update notification preferences
// @access  Private
router.put(
  '/preferences',
  [
    body('email_notifications').optional().isBoolean().withMessage('email_notifications must be a boolean'),
    body('push_notifications').optional().isBoolean().withMessage('push_notifications must be a boolean'),
    body('rehearsal_reminders').optional().isBoolean().withMessage('rehearsal_reminders must be a boolean'),
    body('rehearsal_reminder_hours').optional().isInt({ min: 1, max: 72 }).withMessage('rehearsal_reminder_hours must be between 1 and 72'),
    body('band_updates').optional().isBoolean().withMessage('band_updates must be a boolean'),
    body('band_message_notifications').optional().isBoolean().withMessage('band_message_notifications must be a boolean'),
    body('setlist_updates').optional().isBoolean().withMessage('setlist_updates must be a boolean'),
    body('mute_all').optional().isBoolean().withMessage('mute_all must be a boolean'),
    body('quiet_hours_start').optional().isString().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('quiet_hours_start must be in format HH:MM'),
    body('quiet_hours_end').optional().isString().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('quiet_hours_end must be in format HH:MM'),
    body('use_quiet_hours').optional().isBoolean().withMessage('use_quiet_hours must be a boolean'),
    validateRequest,
  ],
  updateNotificationPreferences
);

export default router;