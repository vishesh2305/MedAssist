import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { validateQuery } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { embassyService } from '../services/embassy.service';

const router = Router();

// ── Validators ────────────────────────────────────

const embassySearchSchema = z.object({
  nationality: z.string().length(2),
  country: z.string().length(2).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * GET /embassies
 * Find embassies by nationality and optionally by host country.
 */
router.get(
  '/',
  validateQuery(embassySearchSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { nationality, country } = req.query as any;

    if (country) {
      const result = embassyService.findByNationality(nationality, country);
      res.json({ success: true, data: result });
      return;
    }

    const result = embassyService.findAllByNationality(nationality);
    res.json({ success: true, data: result });
  })
);

/**
 * GET /embassies/emergency-numbers/:countryCode
 * Get emergency contacts for a country.
 */
router.get(
  '/emergency-numbers/:countryCode',
  asyncHandler(async (req: Request, res: Response) => {
    const result = embassyService.getEmergencyContacts(req.params.countryCode);
    res.json({ success: true, data: result });
  })
);

export default router;
