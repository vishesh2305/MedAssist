import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import hospitalRoutes from './hospital.routes';
import reviewRoutes from './review.routes';
import emergencyRoutes from './emergency.routes';
import chatRoutes from './chat.routes';
import adminRoutes from './admin.routes';
import notificationRoutes from './notification.routes';
import medicalPassportRoutes from './medical-passport.routes';
import documentRoutes from './document.routes';
import consultationRoutes from './consultation.routes';
import paymentRoutes from './payment.routes';
import tripPlannerRoutes from './trip-planner.routes';
import pharmacyRoutes from './pharmacy.routes';
import embassyRoutes from './embassy.routes';
import waitTimeRoutes from './wait-time.routes';
import corporateRoutes from './corporate.routes';
import packagesRoutes from './packages.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/reviews', reviewRoutes);
router.use('/emergency', emergencyRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

// New feature routes
router.use('/medical-passport', medicalPassportRoutes);
router.use('/documents', documentRoutes);
router.use('/consultations', consultationRoutes);
router.use('/payments', paymentRoutes);
router.use('/trip-plans', tripPlannerRoutes);
router.use('/pharmacies', pharmacyRoutes);
router.use('/embassies', embassyRoutes);
router.use('/wait-times', waitTimeRoutes);
router.use('/corporate', corporateRoutes);
router.use('/packages', packagesRoutes);

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
