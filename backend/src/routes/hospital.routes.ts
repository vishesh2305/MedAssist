import { Router } from 'express';
import * as hospitalController from '../controllers/hospital.controller';
import { authenticate, optionalAuth } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createHospitalSchema,
  updateHospitalSchema,
  hospitalSearchSchema,
  addDoctorSchema,
  updateDoctorSchema,
  addPricingSchema,
  updatePricingSchema,
} from '../validators/hospital';

const router = Router();

/**
 * @swagger
 * /hospitals:
 *   get:
 *     tags: [Hospitals]
 *     summary: Search hospitals with filters
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: latitude
 *         schema: { type: number }
 *       - in: query
 *         name: longitude
 *         schema: { type: number }
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 50 }
 *         description: Search radius in km
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: language
 *         schema: { type: string }
 *       - in: query
 *         name: specialty
 *         schema: { type: string }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [rating, distance, name, reviewCount] }
 *       - in: query
 *         name: sortOrder
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated list of hospitals
 */
router.get('/', validateQuery(hospitalSearchSchema), hospitalController.search);

/**
 * @swagger
 * /hospitals/nearby:
 *   get:
 *     tags: [Hospitals]
 *     summary: Find nearby hospitals using real-time OpenStreetMap data
 *     security: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number }
 *         description: Longitude
 *       - in: query
 *         name: radius
 *         schema: { type: integer, default: 10000 }
 *         description: Search radius in meters
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Merged list of registered and OSM-discovered hospitals
 */
router.get('/nearby', hospitalController.nearby);

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital by ID
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Hospital details
 *       404:
 *         description: Hospital not found
 */
router.get('/:id', optionalAuth, hospitalController.getById);

/**
 * @swagger
 * /hospitals:
 *   post:
 *     tags: [Hospitals]
 *     summary: Create a new hospital (Hospital Admin or Super Admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, city, country, latitude, longitude, phone, languages]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               country: { type: string }
 *               latitude: { type: number }
 *               longitude: { type: number }
 *               phone: { type: string }
 *               email: { type: string }
 *               website: { type: string }
 *               isEmergencyCapable: { type: boolean }
 *               languages: { type: array, items: { type: string } }
 *               specialtyIds: { type: array, items: { type: string } }
 *     responses:
 *       201:
 *         description: Hospital created
 */
router.post(
  '/',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(createHospitalSchema),
  hospitalController.create
);

/**
 * @swagger
 * /hospitals/{id}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update hospital
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Hospital updated
 */
router.put(
  '/:id',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(updateHospitalSchema),
  hospitalController.update
);

/**
 * @swagger
 * /hospitals/{id}/doctors:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital doctors
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of doctors
 */
router.get('/:id/doctors', hospitalController.getDoctors);

/**
 * @swagger
 * /hospitals/{id}/doctors:
 *   post:
 *     tags: [Hospitals]
 *     summary: Add doctor to hospital
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Doctor added
 */
router.post(
  '/:id/doctors',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(addDoctorSchema),
  hospitalController.addDoctor
);

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update doctor
 *     responses:
 *       200:
 *         description: Doctor updated
 */
router.put(
  '/:id/doctors/:doctorId',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(updateDoctorSchema),
  hospitalController.updateDoctor
);

/**
 * @swagger
 * /hospitals/{id}/doctors/{doctorId}:
 *   delete:
 *     tags: [Hospitals]
 *     summary: Remove doctor
 *     responses:
 *       200:
 *         description: Doctor removed
 */
router.delete(
  '/:id/doctors/:doctorId',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  hospitalController.removeDoctor
);

/**
 * @swagger
 * /hospitals/{id}/pricing:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital pricing
 *     security: []
 *     responses:
 *       200:
 *         description: Pricing list
 */
router.get('/:id/pricing', hospitalController.getPricing);

/**
 * @swagger
 * /hospitals/{id}/pricing:
 *   post:
 *     tags: [Hospitals]
 *     summary: Add pricing entry
 *     responses:
 *       201:
 *         description: Pricing added
 */
router.post(
  '/:id/pricing',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(addPricingSchema),
  hospitalController.addPricing
);

/**
 * @swagger
 * /hospitals/{id}/pricing/{pricingId}:
 *   put:
 *     tags: [Hospitals]
 *     summary: Update pricing entry
 *     responses:
 *       200:
 *         description: Pricing updated
 */
router.put(
  '/:id/pricing/:pricingId',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  validateBody(updatePricingSchema),
  hospitalController.updatePricing
);

/**
 * @swagger
 * /hospitals/{id}/pricing/{pricingId}:
 *   delete:
 *     tags: [Hospitals]
 *     summary: Remove pricing entry
 *     responses:
 *       200:
 *         description: Pricing removed
 */
router.delete(
  '/:id/pricing/:pricingId',
  authenticate,
  requireRole('HOSPITAL_ADMIN', 'SUPER_ADMIN'),
  hospitalController.removePricing
);

/**
 * @swagger
 * /hospitals/{id}/reviews:
 *   get:
 *     tags: [Hospitals]
 *     summary: Get hospital reviews
 *     security: []
 *     responses:
 *       200:
 *         description: Reviews list
 */
router.get('/:id/reviews', hospitalController.getReviews);

export default router;
