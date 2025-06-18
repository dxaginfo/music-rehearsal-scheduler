import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createSetlist,
  getSetlists,
  getSetlistById,
  updateSetlist,
  deleteSetlist,
  addSongToSetlist,
  removeSongFromSetlist,
  updateSetlistSongOrder
} from '../controllers/setlistController';

const router = Router();

// All setlist routes require authentication
router.use(authenticate);

// @route   GET /api/setlists
// @desc    Get setlists (filtered by band, date, etc.)
// @access  Private
router.get(
  '/',
  [
    query('band_id').optional().isUUID().withMessage('Invalid band ID'),
    query('search').optional().isString(),
    validateRequest,
  ],
  getSetlists
);

// @route   GET /api/setlists/:id
// @desc    Get setlist by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validateRequest,
  ],
  getSetlistById
);

// @route   POST /api/setlists
// @desc    Create a new setlist
// @access  Private
router.post(
  '/',
  [
    body('band_id').isUUID().withMessage('Valid band ID is required'),
    body('name').notEmpty().withMessage('Setlist name is required'),
    body('description').optional(),
    body('is_template').optional().isBoolean(),
    body('duration_min').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('songs').optional().isArray().withMessage('Songs must be an array'),
    body('songs.*.song_id').optional().isUUID().withMessage('Invalid song ID'),
    body('songs.*.order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('songs.*.duration_sec').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('songs.*.notes').optional(),
    validateRequest,
  ],
  createSetlist
);

// @route   PUT /api/setlists/:id
// @desc    Update setlist
// @access  Private
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('name').optional().notEmpty().withMessage('Setlist name cannot be empty'),
    body('description').optional(),
    body('is_template').optional().isBoolean(),
    body('duration_min').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    validateRequest,
  ],
  updateSetlist
);

// @route   DELETE /api/setlists/:id
// @desc    Delete setlist
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    validateRequest,
  ],
  deleteSetlist
);

// @route   POST /api/setlists/:id/songs
// @desc    Add song to setlist
// @access  Private
router.post(
  '/:id/songs',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('song_id').isUUID().withMessage('Valid song ID is required'),
    body('order').optional().isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    body('duration_sec').optional().isInt({ min: 0 }).withMessage('Duration must be a positive integer'),
    body('notes').optional(),
    validateRequest,
  ],
  addSongToSetlist
);

// @route   DELETE /api/setlists/:id/songs/:songId
// @desc    Remove song from setlist
// @access  Private
router.delete(
  '/:id/songs/:songId',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    param('songId').isUUID().withMessage('Invalid song ID'),
    validateRequest,
  ],
  removeSongFromSetlist
);

// @route   PUT /api/setlists/:id/songs/order
// @desc    Update order of songs in a setlist
// @access  Private
router.put(
  '/:id/songs/order',
  [
    param('id').isUUID().withMessage('Invalid setlist ID'),
    body('songs').isArray().withMessage('Songs must be an array'),
    body('songs.*.id').isUUID().withMessage('Valid song ID is required'),
    body('songs.*.order').isInt({ min: 0 }).withMessage('Order must be a positive integer'),
    validateRequest,
  ],
  updateSetlistSongOrder
);

export default router;