import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import {
  createEquipment,
  getEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment,
  assignEquipmentToRehearsal,
  unassignEquipmentFromRehearsal,
  getEquipmentForRehearsal
} from '../controllers/equipmentController';

const router = Router();

// All equipment routes require authentication
router.use(authenticate);

// @route   GET /api/equipment
// @desc    Get equipment (filtered by band, type, etc.)
// @access  Private
router.get(
  '/',
  [
    query('band_id').optional().isUUID().withMessage('Invalid band ID'),
    query('type').optional().isString(),
    query('user_id').optional().isUUID().withMessage('Invalid user ID'),
    query('search').optional().isString(),
    validateRequest,
  ],
  getEquipment
);

// @route   GET /api/equipment/:id
// @desc    Get equipment by ID
// @access  Private
router.get(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid equipment ID'),
    validateRequest,
  ],
  getEquipmentById
);

// @route   POST /api/equipment
// @desc    Create a new equipment item
// @access  Private
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Equipment name is required'),
    body('type').notEmpty().withMessage('Equipment type is required'),
    body('description').optional(),
    body('brand').optional(),
    body('model').optional(),
    body('serial_number').optional(),
    body('purchase_date').optional().isISO8601().withMessage('Invalid date format'),
    body('purchase_price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('notes').optional(),
    body('band_id').optional().isUUID().withMessage('Invalid band ID'),
    body('user_id').optional().isUUID().withMessage('Invalid user ID'),
    body('is_backline').optional().isBoolean(),
    body('needs_power').optional().isBoolean(),
    body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('dimensions').optional(),
    validateRequest,
  ],
  createEquipment
);

// @route   PUT /api/equipment/:id
// @desc    Update equipment
// @access  Private
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid equipment ID'),
    body('name').optional().notEmpty().withMessage('Equipment name cannot be empty'),
    body('type').optional(),
    body('description').optional(),
    body('brand').optional(),
    body('model').optional(),
    body('serial_number').optional(),
    body('purchase_date').optional().isISO8601().withMessage('Invalid date format'),
    body('purchase_price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('notes').optional(),
    body('is_backline').optional().isBoolean(),
    body('needs_power').optional().isBoolean(),
    body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Weight must be a positive number'),
    body('dimensions').optional(),
    validateRequest,
  ],
  updateEquipment
);

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
// @access  Private
router.delete(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid equipment ID'),
    validateRequest,
  ],
  deleteEquipment
);

// @route   GET /api/equipment/rehearsal/:rehearsalId
// @desc    Get equipment assigned to a rehearsal
// @access  Private
router.get(
  '/rehearsal/:rehearsalId',
  [
    param('rehearsalId').isUUID().withMessage('Invalid rehearsal ID'),
    validateRequest,
  ],
  getEquipmentForRehearsal
);

// @route   POST /api/equipment/rehearsal/:rehearsalId
// @desc    Assign equipment to rehearsal
// @access  Private
router.post(
  '/rehearsal/:rehearsalId',
  [
    param('rehearsalId').isUUID().withMessage('Invalid rehearsal ID'),
    body('equipment_ids').isArray().withMessage('Equipment IDs must be an array'),
    body('equipment_ids.*').isUUID().withMessage('Invalid equipment ID'),
    body('notes').optional(),
    validateRequest,
  ],
  assignEquipmentToRehearsal
);

// @route   DELETE /api/equipment/rehearsal/:rehearsalId/:equipmentId
// @desc    Unassign equipment from rehearsal
// @access  Private
router.delete(
  '/rehearsal/:rehearsalId/:equipmentId',
  [
    param('rehearsalId').isUUID().withMessage('Invalid rehearsal ID'),
    param('equipmentId').isUUID().withMessage('Invalid equipment ID'),
    validateRequest,
  ],
  unassignEquipmentFromRehearsal
);

export default router;