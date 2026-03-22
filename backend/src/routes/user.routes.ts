import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { updateProfileSchema } from '../validators/user';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               nationality: { type: string }
 *               preferredLanguage: { type: string }
 *               emergencyContactName: { type: string }
 *               emergencyContactPhone: { type: string }
 *               medicalNotes: { type: string }
 *               travelStatus: { type: string, enum: [TOURIST, LOCAL] }
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', authenticate, validateBody(updateProfileSchema), userController.updateProfile);

/**
 * @swagger
 * /users/favorites:
 *   get:
 *     tags: [Users]
 *     summary: Get user's favorite hospitals
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of favorites
 */
router.get('/favorites', authenticate, userController.getFavorites);

/**
 * @swagger
 * /users/favorites/{hospitalId}:
 *   post:
 *     tags: [Users]
 *     summary: Add hospital to favorites
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Added to favorites
 */
router.post('/favorites/:hospitalId', authenticate, userController.addFavorite);

/**
 * @swagger
 * /users/favorites/{hospitalId}:
 *   delete:
 *     tags: [Users]
 *     summary: Remove hospital from favorites
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Removed from favorites
 */
router.delete('/favorites/:hospitalId', authenticate, userController.removeFavorite);

/**
 * @swagger
 * /users/recently-viewed:
 *   get:
 *     tags: [Users]
 *     summary: Get recently viewed hospitals
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Recently viewed hospitals
 */
router.get('/recently-viewed', authenticate, userController.getRecentlyViewed);

export default router;
