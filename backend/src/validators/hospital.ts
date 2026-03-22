import { z } from 'zod';

export const createHospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name must be at least 2 characters').max(200),
  description: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  isEmergencyCapable: z.boolean().default(false),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  specialtyIds: z.array(z.string().uuid()).optional(),
});

export const updateHospitalSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().min(5).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  isEmergencyCapable: z.boolean().optional(),
  availabilityStatus: z.enum(['OPEN', 'CLOSED', 'LIMITED']).optional(),
  languages: z.array(z.string()).optional(),
  specialtyIds: z.array(z.string().uuid()).optional(),
});

export const hospitalSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().min(1).max(50000).default(50000), // km - defaults to worldwide
  city: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  specialty: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  isEmergencyCapable: z.coerce.boolean().optional(),
  isVerified: z.coerce.boolean().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['rating', 'distance', 'name', 'reviewCount']).default('rating'),
  sortOrder: z.enum(['asc', 'desc']).optional(),
}).transform((data) => ({
  ...data,
  latitude: data.latitude ?? data.lat,
  longitude: data.longitude ?? data.lng,
}));

export const addDoctorSchema = z.object({
  name: z.string().min(2, 'Doctor name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  qualifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default(['English']),
  avatarUrl: z.string().url().optional(),
  isAvailable: z.boolean().default(true),
  consultationFee: z.number().min(0).optional(),
  experience: z.number().int().min(0).optional(),
});

export const updateDoctorSchema = z.object({
  name: z.string().min(2).optional(),
  specialty: z.string().optional(),
  qualifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  avatarUrl: z.string().url().optional(),
  isAvailable: z.boolean().optional(),
  consultationFee: z.number().min(0).optional(),
  experience: z.number().int().min(0).optional(),
});

export const addPricingSchema = z.object({
  serviceName: z.string().min(1, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  minPrice: z.number().min(0, 'Min price must be non-negative'),
  maxPrice: z.number().min(0, 'Max price must be non-negative'),
  currency: z.string().default('USD'),
  description: z.string().optional(),
});

export const updatePricingSchema = z.object({
  serviceName: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
});

export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
export type HospitalSearchInput = z.infer<typeof hospitalSearchSchema>;
export type AddDoctorInput = z.infer<typeof addDoctorSchema>;
export type AddPricingInput = z.infer<typeof addPricingSchema>;
