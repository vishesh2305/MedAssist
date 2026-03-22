import { Router } from 'express';
import * as emergencyController from '../controllers/emergency.controller';
import { authenticate } from '../middleware/auth';
import { emergencyLimiter } from '../middleware/rateLimiter';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const triggerEmergencySchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  notes: z.string().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['TRIGGERED', 'RESPONDED', 'RESOLVED', 'CANCELLED']),
  ambulanceCalled: z.boolean().optional(),
  notes: z.string().optional(),
});

/**
 * @swagger
 * /emergency/trigger:
 *   post:
 *     tags: [Emergency]
 *     summary: Trigger an emergency alert
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Emergency triggered
 */
router.post(
  '/trigger',
  authenticate,
  emergencyLimiter,
  validateBody(triggerEmergencySchema),
  emergencyController.trigger
);

/**
 * @swagger
 * /emergency/{id}/status:
 *   put:
 *     tags: [Emergency]
 *     summary: Update emergency status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [TRIGGERED, RESPONDED, RESOLVED, CANCELLED] }
 *               ambulanceCalled: { type: boolean }
 *               notes: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put(
  '/:id/status',
  authenticate,
  validateBody(updateStatusSchema),
  emergencyController.updateStatus
);

/**
 * @swagger
 * /emergency/active:
 *   get:
 *     tags: [Emergency]
 *     summary: Get active emergencies for current user
 *     responses:
 *       200:
 *         description: Active emergencies
 */
router.get('/active', authenticate, emergencyController.getActive);

/**
 * @swagger
 * /emergency/history:
 *   get:
 *     tags: [Emergency]
 *     summary: Get emergency history
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Emergency history
 */
router.get('/history', authenticate, emergencyController.getHistory);

export default router;
