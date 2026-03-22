import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { HospitalSearchInput } from '../validators/hospital';

// Haversine formula to calculate distance between two coordinates in kilometers
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

export class HospitalService {
  async search(params: HospitalSearchInput) {
    const {
      page,
      limit,
      latitude,
      longitude,
      radius,
      city,
      country,
      language,
      specialty,
      minRating,
      maxPrice,
      minPrice,
      isEmergencyCapable,
      isVerified,
      search,
      sortBy,
      sortOrder: rawSortOrder,
    } = params;

    // Default to ascending for distance sort
    const sortOrder = rawSortOrder ?? (sortBy === 'distance' ? 'asc' : 'desc');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.HospitalWhereInput = {};

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (language) {
      where.languages = {
        some: { language: { equals: language, mode: 'insensitive' } },
      };
    }

    if (specialty) {
      where.specialties = {
        some: {
          specialty: {
            name: { contains: specialty, mode: 'insensitive' },
          },
        },
      };
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    if (isEmergencyCapable !== undefined) {
      where.isEmergencyCapable = isEmergencyCapable;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Price filter: check if hospital has any pricing in range
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Prisma.PricingWhereInput = {};
      if (minPrice !== undefined) priceFilter.minPrice = { gte: minPrice };
      if (maxPrice !== undefined) priceFilter.maxPrice = { lte: maxPrice };
      where.pricing = { some: priceFilter };
    }

    // Build orderBy
    let orderBy: Prisma.HospitalOrderByWithRelationInput = {};
    if (sortBy === 'rating') {
      orderBy = { rating: sortOrder };
    } else if (sortBy === 'name') {
      orderBy = { name: sortOrder };
    } else if (sortBy === 'reviewCount') {
      orderBy = { reviewCount: sortOrder };
    }
    // distance sorting is done post-query

    // When sortBy=distance without coordinates, fall back to normal pagination
    const useDistanceSort = sortBy === 'distance' && latitude !== undefined && longitude !== undefined;

    // Fetch hospitals
    const [hospitals, total] = await Promise.all([
      prisma.hospital.findMany({
        where,
        skip: useDistanceSort ? 0 : skip, // For distance sorting, get all then sort
        take: useDistanceSort ? undefined : limit,
        orderBy: !useDistanceSort && sortBy !== 'distance' ? orderBy : undefined,
        include: {
          languages: { select: { language: true } },
          specialties: {
            include: {
              specialty: { select: { id: true, name: true, icon: true } },
            },
          },
          _count: {
            select: { reviews: true, doctors: true },
          },
        },
      }),
      prisma.hospital.count({ where }),
    ]);

    // Calculate distances and apply location filter
    let results = hospitals.map((hospital) => {
      let distance: number | null = null;
      if (latitude !== undefined && longitude !== undefined) {
        distance = haversineDistance(latitude, longitude, hospital.latitude, hospital.longitude);
      }
      return {
        ...hospital,
        languages: hospital.languages.map((l) => l.language),
        specialties: hospital.specialties.map((s) => s.specialty),
        distance: distance !== null ? Math.round(distance * 100) / 100 : null,
      };
    });

    // Filter by radius if coordinates provided
    if (latitude !== undefined && longitude !== undefined) {
      results = results.filter((h) => h.distance !== null && h.distance <= radius);
    }

    // Calculate totalFiltered BEFORE pagination slicing
    const totalFiltered = latitude !== undefined && longitude !== undefined
      ? results.length
      : total;

    // Sort by distance if requested
    if (useDistanceSort) {
      results.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return sortOrder === 'asc' ? a.distance - b.distance : b.distance - a.distance;
      });
      // Apply pagination after distance sort
      results = results.slice(skip, skip + limit);
    }

    return {
      data: results,
      pagination: {
        page,
        limit,
        total: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
      },
    };
  }

  async findById(id: string) {
    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        languages: { select: { language: true } },
        doctors: {
          where: { isAvailable: true },
          orderBy: { name: 'asc' },
        },
        specialties: {
          include: {
            specialty: true,
          },
        },
        pricing: {
          orderBy: { category: 'asc' },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: { reviews: true, doctors: true, favorites: true },
        },
      },
    });

    if (!hospital) return null;

    return {
      ...hospital,
      languages: hospital.languages.map((l) => l.language),
      specialties: hospital.specialties.map((s) => s.specialty),
    };
  }

  async findNearestHospitals(latitude: number, longitude: number, limit = 5) {
    const hospitals = await prisma.hospital.findMany({
      where: {
        isEmergencyCapable: true,
        availabilityStatus: { not: 'CLOSED' },
      },
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        phone: true,
        latitude: true,
        longitude: true,
        isEmergencyCapable: true,
        availabilityStatus: true,
      },
    });

    const withDistance = hospitals.map((h) => ({
      ...h,
      distance: haversineDistance(latitude, longitude, h.latitude, h.longitude),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);

    return withDistance.slice(0, limit);
  }

  slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
  }
}

export const hospitalService = new HospitalService();
