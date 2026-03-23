import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { paymentService } from '../services/payment.service';

const router = Router();

// ── Validators ────────────────────────────────────

const createIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  consultationId: z.string().uuid().optional(),
  hospitalId: z.string().uuid().optional(),
  description: z.string().max(500).optional(),
});

const refundSchema = z.object({
  reason: z.string().max(500).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /payments/create-intent
 * Create a Stripe payment intent.
 */
router.post(
  '/create-intent',
  authenticate,
  validateBody(createIntentSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { amount, currency, consultationId, hospitalId, description } = req.body;
    const result = await paymentService.createPaymentIntent(req.user!.userId, amount, currency, {
      consultationId,
      hospitalId,
      description,
    });
    res.status(201).json({ success: true, data: result });
  })
);

/**
 * POST /payments/webhook
 * Handle Stripe webhook (no auth required).
 */
router.post(
  '/webhook',
  asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string | undefined;
    const result = await paymentService.handleWebhook(req.body, signature);
    res.json({ success: true, data: result });
  })
);

/**
 * GET /payments
 * Get payment history for the current user.
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const payments = await paymentService.getByUserId(req.user!.userId);
    res.json({ success: true, data: payments });
  })
);

/**
 * POST /payments/:id/refund
 * Refund a payment.
 */
router.post(
  '/:id/refund',
  authenticate,
  validateBody(refundSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.refund(req.params.id, req.body.reason);
    res.json({ success: true, data: result });
  })
);

export default router;
