import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import hospitalRoutes from './hospital.routes';
import reviewRoutes from './review.routes';
import emergencyRoutes from './emergency.routes';
import chatRoutes from './chat.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/reviews', reviewRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MedAssist Global API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
