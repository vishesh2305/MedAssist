import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { documentService } from '../services/document.service';

const router = Router();

// ── Validators ────────────────────────────────────

const uploadSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum([
    'PRESCRIPTION',
    'LAB_REPORT',
    'XRAY',
    'DISCHARGE_SUMMARY',
    'INSURANCE_CARD',
    'VACCINATION_RECORD',
    'OTHER',
  ]),
  description: z.string().max(1000).optional(),
});

const shareSchema = z.object({
  expiryHours: z.number().int().min(1).max(720).default(24),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /documents/upload
 * Upload a medical document.
 * In production, use multer or similar middleware for file handling.
 * This accepts JSON with base64-encoded file data for simplicity.
 */
router.post(
  '/upload',
  authenticate,
  validateBody(
    z.object({
      title: z.string().min(1).max(200),
      type: z.enum([
        'PRESCRIPTION',
        'LAB_REPORT',
        'XRAY',
        'DISCHARGE_SUMMARY',
        'INSURANCE_CARD',
        'VACCINATION_RECORD',
        'OTHER',
      ]),
      description: z.string().max(1000).optional(),
      fileName: z.string().min(1),
      fileData: z.string().min(1), // Base64 encoded
      mimeType: z.string().min(1),
    })
  ),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, type, description, fileName, fileData, mimeType } = req.body;

    const buffer = Buffer.from(fileData, 'base64');

    const document = await documentService.upload(
      req.user!.userId,
      {
        originalname: fileName,
        buffer,
        mimetype: mimeType,
        size: buffer.length,
      },
      { title, type, description }
    );

    res.status(201).json({ success: true, data: document });
  })
);

/**
 * GET /documents
 * List user's documents.
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const documents = await documentService.getByUserId(req.user!.userId);
    res.json({ success: true, data: documents });
  })
);

/**
 * GET /documents/shared/:token
 * Access a shared document (public).
 */
router.get(
  '/shared/:token',
  asyncHandler(async (req: Request, res: Response) => {
    const document = await documentService.getByShareToken(req.params.token);
    res.json({ success: true, data: document });
  })
);

/**
 * GET /documents/:id
 * Get a single document.
 */
router.get(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const document = await documentService.getById(req.params.id, req.user!.userId);
    res.json({ success: true, data: document });
  })
);

/**
 * POST /documents/:id/share
 * Generate a share link for a document.
 */
router.post(
  '/:id/share',
  authenticate,
  validateBody(shareSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { expiryHours } = req.body;
    const shareInfo = await documentService.generateShareLink(
      req.params.id,
      req.user!.userId,
      expiryHours
    );
    res.json({ success: true, data: shareInfo });
  })
);

/**
 * DELETE /documents/:id
 * Delete a document.
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    await documentService.delete(req.params.id, req.user!.userId);
    res.json({ success: true, message: 'Document deleted' });
  })
);

export default router;
