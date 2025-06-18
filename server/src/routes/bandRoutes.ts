import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { 
  createBand, 
  getBands, 
  getBandById,
  updateBand,
  deleteBand,
  addBandMember,
  updateBandMember,
  removeBandMember,
  getBandMembers
} from '../controllers/bandController';

const router = Router();

// All band routes require authentication
router.use(authenticate);

// @route   GET /api/bands
// @desc    Get all bands the user belongs to
// @access  Private
router.get('/', getBands);

// @route   GET /api/bands/:id
// @desc    Get band by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    validateRequest,
  ],
  getBandById
);

// @route   POST /api/bands
// @desc    Create a new band
// @access  Private
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Band name is required'),
    body('description').optional(),
    body('genre').optional(),
    validateRequest,
  ],
  createBand
);

// @route   PUT /api/bands/:id
// @desc    Update band
// @access  Private (Band admin only)
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    body('name').optional().notEmpty().withMessage('Band name cannot be empty'),
    body('description').optional(),
    body('genre').optional(),
    validateRequest,
  ],
  updateBand
);

// @route   DELETE /api/bands/:id
// @desc    Delete band
// @access  Private (Band admin only)
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    validateRequest,
  ],
  deleteBand
);

// @route   GET /api/bands/:id/members
// @desc    Get all band members
// @access  Private
router.get(
  '/:id/members',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    validateRequest,
  ],
  getBandMembers
);

// @route   POST /api/bands/:id/members
// @desc    Add a member to the band
// @access  Private (Band admin only)
router.post(
  '/:id/members',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['admin', 'member']).withMessage('Role must be either admin or member'),
    body('instrument').optional(),
    validateRequest,
  ],
  addBandMember
);

// @route   PUT /api/bands/:id/members/:memberId
// @desc    Update band member
// @access  Private (Band admin only)
router.put(
  '/:id/members/:memberId',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    param('memberId').isUUID().withMessage('Invalid member ID'),
    body('role').optional().isIn(['admin', 'member']).withMessage('Role must be either admin or member'),
    body('instrument').optional(),
    body('is_active').optional().isBoolean().withMessage('is_active must be a boolean'),
    validateRequest,
  ],
  updateBandMember
);

// @route   DELETE /api/bands/:id/members/:memberId
// @desc    Remove a member from the band
// @access  Private (Band admin only)
router.delete(
  '/:id/members/:memberId',
  [
    param('id').isUUID().withMessage('Invalid band ID'),
    param('memberId').isUUID().withMessage('Invalid member ID'),
    validateRequest,
  ],
  removeBandMember
);

export default router;