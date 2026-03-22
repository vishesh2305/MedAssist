import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// All admin routes require SUPER_ADMIN role
router.use(authenticate, requireRole('SUPER_ADMIN'));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [TRAVELER, HOSPITAL_ADMIN, SUPER_ADMIN] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated users
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /admin/hospitals:
 *   get:
 *     tags: [Admin]
 *     summary: Get all hospitals
 *     parameters:
 *       - in: query
 *         name: isVerified
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Hospitals list
 */
router.get('/hospitals', adminController.getHospitals);

/**
 * @swagger
 * /admin/hospitals/{id}/verify:
 *   put:
 *     tags: [Admin]
 *     summary: Verify or unverify a hospital
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isVerified: { type: boolean }
 *     responses:
 *       200:
 *         description: Hospital verification updated
 */
router.put('/hospitals/:id/verify', adminController.verifyHospital);

/**
 * @swagger
 * /admin/reviews/pending:
 *   get:
 *     tags: [Admin]
 *     summary: Get pending reviews
 *     responses:
 *       200:
 *         description: Pending reviews
 */
router.get('/reviews/pending', adminController.getPendingReviews);

/**
 * @swagger
 * /admin/reviews/{id}/approve:
 *   put:
 *     tags: [Admin]
 *     summary: Approve or reject a review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isApproved: { type: boolean }
 *     responses:
 *       200:
 *         description: Review status updated
 */
router.put('/reviews/:id/approve', adminController.approveReview);

/**
 * @swagger
 * /admin/emergency-logs:
 *   get:
 *     tags: [Admin]
 *     summary: Get all emergency logs
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [TRIGGERED, RESPONDED, RESOLVED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Emergency logs
 */
router.get('/emergency-logs', adminController.getEmergencyLogs);

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform analytics
 *     responses:
 *       200:
 *         description: Analytics data
 */
router.get('/analytics', adminController.getAnalytics);

export default router;
