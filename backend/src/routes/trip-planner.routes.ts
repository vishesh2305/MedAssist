import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { tripPlannerService } from '../services/trip-planner.service';

const router = Router();

// ── Validators ────────────────────────────────────

const createTripSchema = z.object({
  destination: z.string().min(1).max(200),
  destinationCode: z.string().length(2).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /trip-plans
 * Create a new trip health plan.
 */
router.post(
  '/',
  authenticate,
  validateBody(createTripSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { destination, destinationCode, startDate, endDate, notes } = req.body;
    const plan = await tripPlannerService.create(
      req.user!.userId,
      destination,
      destinationCode,
      new Date(startDate),
      new Date(endDate),
      notes
    );
    res.status(201).json({ success: true, data: plan });
  })
);

/**
 * GET /trip-plans
 * List user's trip plans.
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const plans = await tripPlannerService.getByUserId(req.user!.userId);
    res.json({ success: true, data: plans });
  })
);

/**
 * GET /trip-plans/vaccinations/:countryCode
 * Get vaccination requirements for a country.
 */
router.get(
  '/vaccinations/:countryCode',
  asyncHandler(async (req: Request, res: Response) => {
    const vaccinations = tripPlannerService.getVaccinationRequirements(req.params.countryCode);
    res.json({
      success: true,
      data: {
        countryCode: req.params.countryCode.toUpperCase(),
        vaccinations,
      },
    });
  })
);

/**
 * GET /trip-plans/emergency-numbers/:countryCode
 * Get local emergency numbers for a country.
 */
router.get(
  '/emergency-numbers/:countryCode',
  asyncHandler(async (req: Request, res: Response) => {
    const numbers = tripPlannerService.getEmergencyNumbers(req.params.countryCode);
    res.json({
      success: true,
      data: {
        countryCode: req.params.countryCode.toUpperCase(),
        emergencyNumbers: numbers,
      },
    });
  })
);

/**
 * GET /trip-plans/:id
 * Get a specific trip plan.
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const plan = await tripPlannerService.getById(req.params.id, req.user!.userId);
    res.json({ success: true, data: plan });
  })
);

/**
 * DELETE /trip-plans/:id
 * Delete a trip plan.
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await tripPlannerService.delete(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Trip plan deleted' });
  })
);

export default router;
