import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateBody, validateQuery } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';

const router = Router();

// ── Validators ────────────────────────────────────

const listPackagesSchema = z.object({
  category: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  minPrice: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().positive().optional()),
  maxPrice: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .pipe(z.number().positive().optional()),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 1))
    .pipe(z.number().int().positive()),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 20))
    .pipe(z.number().int().min(1).max(100)),
});

const createPackageSchema = z.object({
  hospitalId: z.string().uuid().optional(),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  category: z.string().min(1).max(100),
  procedure: z.string().min(1).max(200),
  country: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  price: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  duration: z.string().min(1).max(100),
  includes: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  rating: z.number().min(0).max(5).optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * GET /packages
 * List medical tourism packages with filters.
 */
router.get(
  '/',
  validateQuery(listPackagesSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { category, country, city, minPrice, maxPrice, page, limit } = req.query as any;

    const where: any = { isActive: true };

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }
    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }
    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }
    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }
    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      prisma.medicalPackage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          hospital: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
              rating: true,
            },
          },
        },
      }),
      prisma.medicalPackage.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        packages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  })
);

/**
 * GET /packages/:id
 * Get package details.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const pkg = await prisma.medicalPackage.findUnique({
      where: { id: req.params.id },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            phone: true,
            email: true,
            website: true,
            rating: true,
            reviewCount: true,
            isVerified: true,
          },
        },
      },
    });

    if (!pkg) {
      throw ApiError.notFound('Package not found');
    }

    res.json({ success: true, data: pkg });
  })
);

/**
 * POST /packages
 * Create a new medical tourism package (hospital admin).
 */
router.post(
  '/',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(createPackageSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const pkg = await prisma.medicalPackage.create({
      data: req.body,
    });
    res.status(201).json({ success: true, data: pkg });
  })
);

export default router;
