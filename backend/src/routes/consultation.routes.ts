import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { consultationService } from '../services/consultation.service';

const router = Router();

// ── Validators ────────────────────────────────────

const createConsultationSchema = z.object({
  doctorId: z.string().uuid().optional(),
  hospitalId: z.string().uuid().optional(),
  type: z.enum(['VIDEO', 'AUDIO', 'CHAT']),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['SCHEDULED', 'WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
});

const completeSchema = z.object({
  notes: z.string().max(5000).optional(),
  prescription: z.string().max(5000).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /consultations
 * Book a new consultation.
 */
router.post(
  '/',
  authenticate,
  validateBody(createConsultationSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const data = {
      ...req.body,
      scheduledAt: new Date(req.body.scheduledAt),
    };
    const consultation = await consultationService.create(req.user!.userId, data);
    res.status(201).json({ success: true, data: consultation });
  })
);

/**
 * GET /consultations
 * List user's consultations.
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const consultations = await consultationService.getByUserId(req.user!.userId);
    res.json({ success: true, data: consultations });
  })
);

/**
 * GET /consultations/:id
 * Get consultation details.
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const consultation = await consultationService.getById(req.params.id);
    res.json({ success: true, data: consultation });
  })
);

/**
 * PUT /consultations/:id/status
 * Update consultation status.
 */
router.put(
  '/:id/status',
  authenticate,
  validateBody(updateStatusSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const consultation = await consultationService.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, data: consultation });
  })
);

/**
 * POST /consultations/:id/complete
 * Complete a consultation with notes and prescription.
 */
router.post(
  '/:id/complete',
  authenticate,
  validateBody(completeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { notes, prescription } = req.body;
    const consultation = await consultationService.complete(req.params.id, notes, prescription);
    res.json({ success: true, data: consultation });
  })
);

export default router;
