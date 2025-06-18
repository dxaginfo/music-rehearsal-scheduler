import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  addSongAttachment,
  deleteSongAttachment,
  addSongNote,
  getSongNotes,
  updateSongNote,
  deleteSongNote
} from '../controllers/songController';

const router = Router();

// All song routes require authentication
router.use(authenticate);

// @route   GET /api/songs
// @desc    Get songs (filtered by band, status, etc.)
// @access  Private
router.get(
  '/',
  [
    query('band_id').optional().isUUID().withMessage('Invalid band ID'),
    query('status').optional().isIn(['active', 'learning', 'archived']).withMessage('Invalid status'),
    query('search').optional().isString(),
    validateRequest,
  ],
  getSongs
);

// @route   GET /api/songs/:id
// @desc    Get song by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validateRequest,
  ],
  getSongById
);

// @route   POST /api/songs
// @desc    Create a new song
// @access  Private
router.post(
  '/',
  [
    body('band_id').isUUID().withMessage('Valid band ID is required'),
    body('title').notEmpty().withMessage('Song title is required'),
    body('artist').optional(),
    body('key').optional(),
    body('bpm').optional().isInt({ min: 1, max: 300 }).withMessage('BPM must be between 1 and 300'),
    body('duration_sec').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('lyrics').optional(),
    body('chord_chart').optional(),
    body('notes').optional(),
    body('status').optional().isIn(['active', 'learning', 'archived']).withMessage('Invalid status'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    body('reference_url').optional().isURL().withMessage('Invalid URL format'),
    validateRequest,
  ],
  createSong
);

// @route   PUT /api/songs/:id
// @desc    Update song
// @access  Private
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    body('title').optional().notEmpty().withMessage('Song title cannot be empty'),
    body('artist').optional(),
    body('key').optional(),
    body('bpm').optional().isInt({ min: 1, max: 300 }).withMessage('BPM must be between 1 and 300'),
    body('duration_sec').optional().isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
    body('lyrics').optional(),
    body('chord_chart').optional(),
    body('notes').optional(),
    body('status').optional().isIn(['active', 'learning', 'archived']).withMessage('Invalid status'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty'),
    body('reference_url').optional().isURL().withMessage('Invalid URL format'),
    validateRequest,
  ],
  updateSong
);

// @route   DELETE /api/songs/:id
// @desc    Delete song
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validateRequest,
  ],
  deleteSong
);

// @route   POST /api/songs/:id/attachments
// @desc    Add attachment to song
// @access  Private
router.post(
  '/:id/attachments',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    body('name').notEmpty().withMessage('Attachment name is required'),
    body('file_url').notEmpty().withMessage('File URL is required'),
    body('file_type').optional(),
    body('description').optional(),
    validateRequest,
  ],
  addSongAttachment
);

// @route   DELETE /api/songs/:id/attachments/:attachmentId
// @desc    Delete song attachment
// @access  Private
router.delete(
  '/:id/attachments/:attachmentId',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    param('attachmentId').isUUID().withMessage('Invalid attachment ID'),
    validateRequest,
  ],
  deleteSongAttachment
);

// @route   GET /api/songs/:id/notes
// @desc    Get notes for a song
// @access  Private
router.get(
  '/:id/notes',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    validateRequest,
  ],
  getSongNotes
);

// @route   POST /api/songs/:id/notes
// @desc    Add note to song
// @access  Private
router.post(
  '/:id/notes',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    body('content').notEmpty().withMessage('Note content is required'),
    validateRequest,
  ],
  addSongNote
);

// @route   PUT /api/songs/:id/notes/:noteId
// @desc    Update song note
// @access  Private
router.put(
  '/:id/notes/:noteId',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    param('noteId').isUUID().withMessage('Invalid note ID'),
    body('content').notEmpty().withMessage('Note content is required'),
    validateRequest,
  ],
  updateSongNote
);

// @route   DELETE /api/songs/:id/notes/:noteId
// @desc    Delete song note
// @access  Private
router.delete(
  '/:id/notes/:noteId',
  [
    param('id').isUUID().withMessage('Invalid song ID'),
    param('noteId').isUUID().withMessage('Invalid note ID'),
    validateRequest,
  ],
  deleteSongNote
);

export default router;