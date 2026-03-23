import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { pharmacyService } from '../services/pharmacy.service';

const router = Router();

// ── Validators ────────────────────────────────────

const nearbySchema = z.object({
  lat: z.string().transform(Number).pipe(z.number().min(-90).max(90)),
  lng: z.string().transform(Number).pipe(z.number().min(-180).max(180)),
  radius: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 5000))
    .pipe(z.number().min(100).max(50000)),
});

const medicineSchema = z.object({
  name: z.string().min(2).max(200),
  countryCode: z.string().length(2).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * GET /pharmacies/nearby
 * Find nearby pharmacies using OpenStreetMap data.
 */
router.get(
  '/nearby',
  validateQuery(nearbySchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { lat, lng, radius } = req.query as any;
    const pharmacies = await pharmacyService.findNearby(lat, lng, radius);
    res.json({
      success: true,
      data: {
        pharmacies,
        count: pharmacies.length,
      },
    });
  })
);

/**
 * GET /pharmacies/medicine-equivalent
 * Find medicine equivalent name in another country.
 */
router.get(
  '/medicine-equivalent',
  validateQuery(medicineSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { name, countryCode } = req.query as any;
    const result = pharmacyService.findMedicineEquivalent(name, countryCode);
    res.json({ success: true, data: result });
  })
);

export default router;
