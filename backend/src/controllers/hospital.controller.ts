import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database';
import { hospitalService } from '../services/hospital.service';

export const search = asyncHandler(async (req: Request, res: Response) => {
  const result = await hospitalService.search(req.query as any);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;

  // Handle OSM hospital IDs (format: osm-123456)
  if (id.startsWith('osm-')) {
    const osmId = id.replace('osm-', '');
    const { fetchOsmHospitalById } = await import('../services/places.service');
    const osmHospital = await fetchOsmHospitalById(osmId);
    if (!osmHospital) {
      throw ApiError.notFound('Hospital not found');
    }

    // Enrich OSM hospital with Google Places data
    const hospitalData: any = { ...osmHospital };
    const { enrichHospitalWithGoogleData, getPhotoUrl, getDirectionsUrl, isGooglePlacesAvailable } = await import('../services/google-places.service');

    if (isGooglePlacesAvailable() && hospitalData.latitude && hospitalData.longitude) {
      const googleData = await enrichHospitalWithGoogleData(
        hospitalData.name,
        hospitalData.latitude,
        hospitalData.longitude
      );

      if (googleData) {
        hospitalData.phone = googleData.international_phone_number || googleData.formatted_phone_number || hospitalData.phone;
        hospitalData.website = googleData.website || hospitalData.website;
        hospitalData.googleMapsUrl = googleData.url || null;
        hospitalData.googleRating = googleData.rating || null;
        hospitalData.googleReviewCount = googleData.user_ratings_total || null;
        hospitalData.googleReviews = (googleData.reviews || []).map(r => ({
          authorName: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.time,
          profilePhotoUrl: r.profile_photo_url,
          relativeTime: r.relative_time_description,
        }));
        hospitalData.photos = (googleData.photos || []).slice(0, 10).map(p => getPhotoUrl(p.photo_reference, 800));
        hospitalData.openingHours = googleData.opening_hours?.weekday_text || null;
        hospitalData.isOpenNow = googleData.opening_hours?.open_now ?? null;

        if (googleData.formatted_address) {
          hospitalData.address = googleData.formatted_address;
        }
      }
    }

    // Always add directions URL (works without API key)
    if (hospitalData.latitude && hospitalData.longitude) {
      hospitalData.directionsUrl = getDirectionsUrl(
        hospitalData.latitude,
        hospitalData.longitude,
        hospitalData.name
      );
    }

    res.status(200).json({
      success: true,
      data: hospitalData,
    });
    return;
  }

  const hospital = await hospitalService.findById(id);

  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  // Track recently viewed if user is authenticated
  if (req.user) {
    await prisma.recentlyViewed.upsert({
      where: {
        userId_hospitalId: {
          userId: req.user.userId,
          hospitalId: id,
        },
      },
      update: { viewedAt: new Date() },
      create: {
        userId: req.user.userId,
        hospitalId: id,
      },
    }).catch(() => {}); // Non-critical operation
  }

  // Enrich DB hospital with Google Places data
  const hospitalData: any = { ...(hospital as any) };
  const { enrichHospitalWithGoogleData, getPhotoUrl, getDirectionsUrl, isGooglePlacesAvailable } = await import('../services/google-places.service');

  if (isGooglePlacesAvailable() && hospitalData.latitude && hospitalData.longitude) {
    const googleData = await enrichHospitalWithGoogleData(
      hospitalData.name,
      hospitalData.latitude,
      hospitalData.longitude
    );

    if (googleData) {
      hospitalData.phone = googleData.international_phone_number || googleData.formatted_phone_number || hospitalData.phone;
      hospitalData.website = googleData.website || hospitalData.website;
      hospitalData.googleMapsUrl = googleData.url || null;
      hospitalData.googleRating = googleData.rating || null;
      hospitalData.googleReviewCount = googleData.user_ratings_total || null;
      hospitalData.googleReviews = (googleData.reviews || []).map(r => ({
        authorName: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.time,
        profilePhotoUrl: r.profile_photo_url,
        relativeTime: r.relative_time_description,
      }));
      hospitalData.photos = (googleData.photos || []).slice(0, 10).map(p => getPhotoUrl(p.photo_reference, 800));
      hospitalData.openingHours = googleData.opening_hours?.weekday_text || null;
      hospitalData.isOpenNow = googleData.opening_hours?.open_now ?? null;

      if (googleData.formatted_address) {
        hospitalData.address = googleData.formatted_address;
      }
    }
  }

  // Always add directions URL (works without API key)
  if (hospitalData.latitude && hospitalData.longitude) {
    hospitalData.directionsUrl = getDirectionsUrl(
      hospitalData.latitude,
      hospitalData.longitude,
      hospitalData.name
    );
  }

  res.status(200).json({
    success: true,
    data: hospitalData,
  });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { languages, specialtyIds, ...hospitalData } = req.body;

  const slug = hospitalService.slugify(hospitalData.name);

  const hospital = await prisma.$transaction(async (tx) => {
    const created = await tx.hospital.create({
      data: {
        ...hospitalData,
        slug,
        adminUserId: req.user!.userId,
        languages: {
          create: languages.map((lang: string) => ({ language: lang })),
        },
      },
    });

    if (specialtyIds && specialtyIds.length > 0) {
      await tx.hospitalSpecialty.createMany({
        data: specialtyIds.map((specialtyId: string) => ({
          hospitalId: created.id,
          specialtyId,
        })),
        skipDuplicates: true,
      });
    }

    return tx.hospital.findUnique({
      where: { id: created.id },
      include: {
        languages: { select: { language: true } },
        specialties: {
          include: { specialty: true },
        },
      },
    });
  });

  res.status(201).json({
    success: true,
    message: 'Hospital created successfully',
    data: hospital,
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { languages, specialtyIds, ...updateData } = req.body;

  // Verify ownership (unless super admin)
  const existing = await prisma.hospital.findUnique({ where: { id } });
  if (!existing) {
    throw ApiError.notFound('Hospital not found');
  }
  if (req.user!.role !== 'SUPER_ADMIN' && existing.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only update your own hospital');
  }

  const hospital = await prisma.$transaction(async (tx) => {
    const updated = await tx.hospital.update({
      where: { id },
      data: updateData,
    });

    if (languages) {
      await tx.hospitalLanguage.deleteMany({ where: { hospitalId: id } });
      await tx.hospitalLanguage.createMany({
        data: languages.map((lang: string) => ({ hospitalId: id, language: lang })),
      });
    }

    if (specialtyIds) {
      await tx.hospitalSpecialty.deleteMany({ where: { hospitalId: id } });
      await tx.hospitalSpecialty.createMany({
        data: specialtyIds.map((sid: string) => ({ hospitalId: id, specialtyId: sid })),
        skipDuplicates: true,
      });
    }

    return tx.hospital.findUnique({
      where: { id },
      include: {
        languages: { select: { language: true } },
        specialties: { include: { specialty: true } },
      },
    });
  });

  res.status(200).json({
    success: true,
    message: 'Hospital updated successfully',
    data: hospital,
  });
});

export const getDoctors = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  const doctors = await prisma.doctor.findMany({
    where: { hospitalId: id },
    orderBy: { name: 'asc' },
  });

  res.status(200).json({
    success: true,
    data: doctors,
  });
});

export const addDoctor = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only add doctors to your own hospital');
  }

  const doctor = await prisma.doctor.create({
    data: {
      hospitalId: id,
      ...req.body,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Doctor added successfully',
    data: doctor,
  });
});

export const updateDoctor = asyncHandler(async (req: Request, res: Response) => {
  const { id, doctorId } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only update doctors in your own hospital');
  }

  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, hospitalId: id },
  });
  if (!doctor) throw ApiError.notFound('Doctor not found');

  const updated = await prisma.doctor.update({
    where: { id: doctorId },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: 'Doctor updated successfully',
    data: updated,
  });
});

export const removeDoctor = asyncHandler(async (req: Request, res: Response) => {
  const { id, doctorId } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only remove doctors from your own hospital');
  }

  const doctor = await prisma.doctor.findFirst({
    where: { id: doctorId, hospitalId: id },
  });
  if (!doctor) throw ApiError.notFound('Doctor not found');

  await prisma.doctor.delete({ where: { id: doctorId } });

  res.status(200).json({
    success: true,
    message: 'Doctor removed successfully',
  });
});

export const getPricing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');

  const pricing = await prisma.pricing.findMany({
    where: { hospitalId: id },
    orderBy: [{ category: 'asc' }, { serviceName: 'asc' }],
  });

  res.status(200).json({
    success: true,
    data: pricing,
  });
});

export const addPricing = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only add pricing to your own hospital');
  }

  if (req.body.maxPrice < req.body.minPrice) {
    throw ApiError.badRequest('Max price must be greater than or equal to min price');
  }

  const pricing = await prisma.pricing.create({
    data: {
      hospitalId: id,
      ...req.body,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Pricing added successfully',
    data: pricing,
  });
});

export const updatePricing = asyncHandler(async (req: Request, res: Response) => {
  const { id, pricingId } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only update pricing for your own hospital');
  }

  const pricing = await prisma.pricing.findFirst({
    where: { id: pricingId, hospitalId: id },
  });
  if (!pricing) throw ApiError.notFound('Pricing entry not found');

  const updated = await prisma.pricing.update({
    where: { id: pricingId },
    data: req.body,
  });

  res.status(200).json({
    success: true,
    message: 'Pricing updated successfully',
    data: updated,
  });
});

export const removePricing = asyncHandler(async (req: Request, res: Response) => {
  const { id, pricingId } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');
  if (req.user!.role !== 'SUPER_ADMIN' && hospital.adminUserId !== req.user!.userId) {
    throw ApiError.forbidden('You can only remove pricing from your own hospital');
  }

  const pricing = await prisma.pricing.findFirst({
    where: { id: pricingId, hospitalId: id },
  });
  if (!pricing) throw ApiError.notFound('Pricing entry not found');

  await prisma.pricing.delete({ where: { id: pricingId } });

  res.status(200).json({
    success: true,
    message: 'Pricing removed successfully',
  });
});

export const nearby = asyncHandler(async (req: Request, res: Response) => {
  const lat = parseFloat(req.query.lat as string || req.query.latitude as string);
  const lng = parseFloat(req.query.lng as string || req.query.longitude as string);
  const radius = parseInt(req.query.radius as string) || 10000; // meters
  const limit = parseInt(req.query.limit as string) || 20;

  if (isNaN(lat) || isNaN(lng)) {
    throw ApiError.badRequest('latitude and longitude are required');
  }

  const { findNearbyHospitals } = await import('../services/places.service');

  // Get real-time hospitals from OpenStreetMap
  const osmHospitals = await findNearbyHospitals(lat, lng, radius, limit);

  // Also get our registered hospitals with distance
  const dbResult = await hospitalService.search({
    latitude: lat,
    longitude: lng,
    radius: 50000,
    page: 1,
    limit: 5,
    sortBy: 'distance',
    sortOrder: 'asc',
  });

  // Merge: our registered hospitals first (they have verified info), then OSM
  const registered = dbResult.data.map((h: any) => ({
    ...h,
    source: 'registered',
  }));

  // Deduplicate by proximity (if OSM hospital is within 200m of a registered one, skip it)
  const merged = [...registered];
  for (const osm of osmHospitals) {
    const isDuplicate = registered.some((reg: any) => {
      const dist = Math.sqrt(
        Math.pow(reg.latitude - osm.latitude, 2) +
        Math.pow(reg.longitude - osm.longitude, 2)
      ) * 111000; // rough meters
      return dist < 200;
    });
    if (!isDuplicate) {
      merged.push(osm);
    }
  }

  // Sort by distance
  merged.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));

  res.json({
    success: true,
    data: merged.slice(0, limit),
    meta: {
      registeredCount: registered.length,
      osmCount: osmHospitals.length,
      totalReturned: Math.min(merged.length, limit),
    },
  });
});

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) throw ApiError.notFound('Hospital not found');

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { hospitalId: id, isApproved: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { hospitalId: id, isApproved: true } }),
  ]);

  res.status(200).json({
    success: true,
    data: reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});
