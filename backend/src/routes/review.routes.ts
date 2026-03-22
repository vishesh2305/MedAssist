import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createReviewSchema, updateReviewSchema } from '../validators/review';

const router = Router();

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review for a hospital
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hospitalId, rating, content]
 *             properties:
 *               hospitalId: { type: string, format: uuid }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 */
router.post('/', authenticate, validateBody(createReviewSchema), reviewController.create);

/**
 * @swagger
 * /reviews/hospital/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a hospital
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Hospital reviews with rating summary
 */
router.get('/hospital/:id', reviewController.getByHospital);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update own review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/:id', authenticate, validateBody(updateReviewSchema), reviewController.update);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete own review
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:id', authenticate, reviewController.remove);

export default router;
