import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      nationality: true,
      preferredLanguage: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      medicalNotes: true,
      travelStatus: true,
      role: true,
      emailVerified: true,
      phoneVerified: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          favorites: true,
          reviews: true,
          emergencyLogs: true,
        },
      },
    },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  // Check if phone is being changed and is already taken
  if (req.body.phone) {
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone: req.body.phone,
        id: { not: req.user!.userId },
      },
    });
    if (existingPhone) {
      throw ApiError.conflict('This phone number is already in use');
    }
  }

  // Explicitly whitelist allowed fields to prevent mass assignment
  const { firstName, lastName, phone, nationality, preferredLanguage, emergencyContactName, emergencyContactPhone, medicalNotes, travelStatus, avatarUrl } = req.body;
  const updateData: any = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (phone !== undefined) updateData.phone = phone;
  if (nationality !== undefined) updateData.nationality = nationality;
  if (preferredLanguage !== undefined) updateData.preferredLanguage = preferredLanguage;
  if (emergencyContactName !== undefined) updateData.emergencyContactName = emergencyContactName;
  if (emergencyContactPhone !== undefined) updateData.emergencyContactPhone = emergencyContactPhone;
  if (medicalNotes !== undefined) updateData.medicalNotes = medicalNotes;
  if (travelStatus !== undefined) updateData.travelStatus = travelStatus;
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      nationality: true,
      preferredLanguage: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      medicalNotes: true,
      travelStatus: true,
      role: true,
      emailVerified: true,
      phoneVerified: true,
      avatarUrl: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: {
        hospital: {
          include: {
            languages: { select: { language: true } },
            _count: { select: { reviews: true, doctors: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.favorite.count({ where: { userId: req.user!.userId } }),
  ]);

  const data = favorites.map((f) => ({
    ...f,
    hospital: {
      ...f.hospital,
      languages: f.hospital.languages.map((l) => l.language),
    },
  }));

  res.status(200).json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const addFavorite = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId } = req.params;

  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_hospitalId: {
        userId: req.user!.userId,
        hospitalId,
      },
    },
  });

  if (existing) {
    throw ApiError.conflict('Hospital is already in your favorites');
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId: req.user!.userId,
      hospitalId,
    },
    include: {
      hospital: {
        select: { id: true, name: true, city: true, country: true, coverImage: true, rating: true },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Hospital added to favorites',
    data: favorite,
  });
});

export const removeFavorite = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId } = req.params;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_hospitalId: {
        userId: req.user!.userId,
        hospitalId,
      },
    },
  });

  if (!favorite) {
    throw ApiError.notFound('Hospital not in your favorites');
  }

  await prisma.favorite.delete({
    where: { id: favorite.id },
  });

  res.status(200).json({
    success: true,
    message: 'Hospital removed from favorites',
  });
});

export const getRecentlyViewed = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;

  const recentlyViewed = await prisma.recentlyViewed.findMany({
    where: { userId: req.user!.userId },
    include: {
      hospital: {
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          coverImage: true,
          rating: true,
          reviewCount: true,
          availabilityStatus: true,
        },
      },
    },
    orderBy: { viewedAt: 'desc' },
    take: limit,
  });

  res.status(200).json({
    success: true,
    data: recentlyViewed,
  });
});

export const addRecentlyViewed = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId } = req.body;

  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  await prisma.recentlyViewed.upsert({
    where: {
      userId_hospitalId: {
        userId: req.user!.userId,
        hospitalId,
      },
    },
    update: { viewedAt: new Date() },
    create: {
      userId: req.user!.userId,
      hospitalId,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Recently viewed updated',
  });
});
