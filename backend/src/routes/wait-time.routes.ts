import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { waitTimeService } from '../services/wait-time.service';

const router = Router();

// ── Validators ────────────────────────────────────

const reportSchema = z.object({
  hospitalId: z.string().uuid(),
  department: z.string().max(100).optional(),
  waitMinutes: z.number().int().min(0).max(720),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /wait-times/report
 * Report a wait time at a hospital.
 */
router.post(
  '/report',
  authenticate,
  validateBody(reportSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { hospitalId, department, waitMinutes } = req.body;
    const report = await waitTimeService.report(
      req.user!.userId,
      hospitalId,
      department,
      waitMinutes
    );
    res.status(201).json({ success: true, data: report });
  })
);

/**
 * GET /wait-times/:hospitalId
 * Get estimated wait time for a hospital.
 */
router.get(
  '/:hospitalId',
  asyncHandler(async (req: Request, res: Response) => {
    const department = req.query.department as string | undefined;
    const estimate = await waitTimeService.getEstimate(req.params.hospitalId, department);
    res.json({ success: true, data: estimate });
  })
);

/**
 * GET /wait-times/:hospitalId/best-times
 * Get historical best times to visit a hospital.
 */
router.get(
  '/:hospitalId/best-times',
  asyncHandler(async (req: Request, res: Response) => {
    const bestTimes = await waitTimeService.getBestTimes(req.params.hospitalId);
    res.json({ success: true, data: bestTimes });
  })
);

export default router;
