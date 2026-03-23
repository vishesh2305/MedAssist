import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { corporateService } from '../services/corporate.service';

const router = Router();

// ── Validators ────────────────────────────────────

const createProgramSchema = z.object({
  companyName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(50).optional(),
  employeeCount: z.number().int().positive().optional(),
  plan: z.enum(['standard', 'premium', 'enterprise']).optional(),
  features: z.array(z.string()).optional(),
  monthlyFee: z.number().positive().optional(),
});

const addEmployeeSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  department: z.string().max(100).optional(),
  userId: z.string().uuid().optional(),
});

// ── Routes ────────────────────────────────────────

/**
 * POST /corporate/programs
 * Create a new corporate program (admin only).
 */
router.post(
  '/programs',
  authenticate,
  requireRole('SUPER_ADMIN', 'HOSPITAL_ADMIN'),
  validateBody(createProgramSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const program = await corporateService.createProgram(req.body);
    res.status(201).json({ success: true, data: program });
  })
);

/**
 * GET /corporate/programs/:id
 * Get corporate program details.
 */
router.get(
  '/programs/:id',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const program = await corporateService.getProgram(req.params.id);
    res.json({ success: true, data: program });
  })
);

/**
 * POST /corporate/programs/:id/employees
 * Add an employee to a corporate program.
 */
router.post(
  '/programs/:id/employees',
  authenticate,
  requireRole('SUPER_ADMIN', 'HOSPITAL_ADMIN'),
  validateBody(addEmployeeSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const employee = await corporateService.addEmployee(req.params.id, req.body);
    res.status(201).json({ success: true, data: employee });
  })
);

/**
 * GET /corporate/programs/:id/dashboard
 * Get analytics dashboard for a corporate program.
 */
router.get(
  '/programs/:id/dashboard',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const dashboard = await corporateService.getDashboard(req.params.id);
    res.json({ success: true, data: dashboard });
  })
);

/**
 * GET /corporate/programs/:id/locations
 * Get employee locations for a corporate program.
 */
router.get(
  '/programs/:id/locations',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const locations = await corporateService.getEmployeeLocations(req.params.id);
    res.json({ success: true, data: locations });
  })
);

export default router;
