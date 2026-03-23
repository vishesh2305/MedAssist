import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { medicalPassportService } from '../services/medical-passport.service';

const router = Router();

// ── Validators ────────────────────────────────────

const updatePassportSchema = z.object({
  bloodType: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  allergies: z.array(z.string().max(200)).optional(),
  medications: z.array(z.string().max(200)).optional(),
  conditions: z.array(z.string().max(200)).optional(),
  vaccinations: z
    .array(
      z.object({
        name: z.string(),
        date: z.string(),
        expiryDate: z.string().optional(),
      })
    )
    .optional(),
  insuranceProvider: z.string().max(200).optional(),
  insurancePolicyNo: z.string().max(100).optional(),
  insurancePhone: z.string().max(50).optional(),
  insuranceExpiry: z.string().datetime().optional(),
});

const decodeQRSchema = z.object({
  qrData: z.string().min(1, 'QR data is required'),
});

// ── Routes ────────────────────────────────────────

/**
 * GET /medical-passport
 * Get current user's medical passport.
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const passport = await medicalPassportService.getByUserId(req.user!.userId);
    res.json({ success: true, data: passport });
  })
);

/**
 * PUT /medical-passport
 * Create or update medical passport.
 */
router.put(
  '/',
  authenticate,
  validateBody(updatePassportSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;

    // Convert insuranceExpiry string to Date if provided
    if (data.insuranceExpiry) {
      data.insuranceExpiry = new Date(data.insuranceExpiry);
    }

    const passport = await medicalPassportService.createOrUpdate(req.user!.userId, data);
    res.json({ success: true, data: passport });
  })
);

/**
 * GET /medical-passport/qr
 * Generate QR code data for the medical passport.
 */
router.get(
  '/qr',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const qrResult = await medicalPassportService.generateQRCode(req.user!.userId);
    res.json({ success: true, data: qrResult });
  })
);

/**
 * POST /medical-passport/decode
 * Decode QR code data (public endpoint for hospital scanning).
 */
router.post(
  '/decode',
  validateBody(decodeQRSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { qrData } = req.body;
    const decoded = medicalPassportService.decodeQRCode(qrData);
    res.json({ success: true, data: decoded });
  })
);

export default router;
