import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import bandRoutes from './bandRoutes';
import rehearsalRoutes from './rehearsalRoutes';
import venueRoutes from './venueRoutes';
import equipmentRoutes from './equipmentRoutes';
import setlistRoutes from './setlistRoutes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is up and running' });
});

// API version and documentation
router.get('/', (req, res) => {
  res.status(200).json({
    api: 'Music Rehearsal Scheduler API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/bands', bandRoutes);
router.use('/rehearsals', rehearsalRoutes);
router.use('/venues', venueRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/setlists', setlistRoutes);

export default router;