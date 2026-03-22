import { Router } from 'express';
import * as chatController from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createRoomSchema = z.object({
  name: z.string().optional(),
  type: z.enum(['SUPPORT', 'EMERGENCY', 'CONSULTATION']).default('SUPPORT'),
  hospitalId: z.string().uuid().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
  messageType: z.enum(['TEXT', 'IMAGE', 'LOCATION', 'SYSTEM']).default('TEXT'),
  translatedContent: z.string().optional(),
});

/**
 * @swagger
 * /chat/rooms:
 *   post:
 *     tags: [Chat]
 *     summary: Create a chat room
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               type: { type: string, enum: [SUPPORT, EMERGENCY, CONSULTATION] }
 *               hospitalId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Chat room created
 */
router.post('/rooms', authenticate, validateBody(createRoomSchema), chatController.createRoom);

/**
 * @swagger
 * /chat/rooms:
 *   get:
 *     tags: [Chat]
 *     summary: Get user's chat rooms
 *     responses:
 *       200:
 *         description: List of chat rooms
 */
router.get('/rooms', authenticate, chatController.getRooms);

/**
 * @swagger
 * /chat/rooms/{id}/messages:
 *   get:
 *     tags: [Chat]
 *     summary: Get messages in a chat room
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
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200:
 *         description: Chat messages
 */
router.get('/rooms/:id/messages', authenticate, chatController.getMessages);

/**
 * @swagger
 * /chat/rooms/{id}/messages:
 *   post:
 *     tags: [Chat]
 *     summary: Send a message in a chat room
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
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *               messageType: { type: string, enum: [TEXT, IMAGE, LOCATION, SYSTEM] }
 *               translatedContent: { type: string }
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post(
  '/rooms/:id/messages',
  authenticate,
  validateBody(sendMessageSchema),
  chatController.sendMessage
);

export default router;
