import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        nationality: true,
        travelStatus: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        avatarUrl: true,
        createdAt: true,
        _count: {
          select: { reviews: true, emergencyLogs: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getHospitals = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const isVerified = req.query.isVerified !== undefined
    ? req.query.isVerified === 'true'
    : undefined;

  const where: any = {};
  if (isVerified !== undefined) where.isVerified = isVerified;

  const [hospitals, total] = await Promise.all([
    prisma.hospital.findMany({
      where,
      include: {
        languages: { select: { language: true } },
        _count: { select: { reviews: true, doctors: true } },
        adminUser: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.hospital.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: hospitals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const verifyHospital = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isVerified } = req.body;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  const updated = await prisma.hospital.update({
    where: { id },
    data: { isVerified: isVerified !== undefined ? isVerified : true },
  });

  res.status(200).json({
    success: true,
    message: `Hospital ${updated.isVerified ? 'verified' : 'unverified'} successfully`,
    data: updated,
  });
});

export const getPendingReviews = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { isApproved: false },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        hospital: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { isApproved: false } }),
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

export const approveReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  const approved = isApproved !== undefined ? isApproved : true;

  await prisma.review.update({
    where: { id },
    data: { isApproved: approved },
  });

  // Recalculate hospital rating
  const aggregation = await prisma.review.aggregate({
    where: { hospitalId: review.hospitalId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.hospital.update({
    where: { id: review.hospitalId },
    data: {
      rating: aggregation._avg.rating
        ? Math.round(aggregation._avg.rating * 10) / 10
        : 0,
      reviewCount: aggregation._count.rating,
    },
  });

  res.status(200).json({
    success: true,
    message: `Review ${approved ? 'approved' : 'rejected'} successfully`,
  });
});

export const getEmergencyLogs = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status as string | undefined;

  const where: any = {};
  if (status) where.status = status;

  const [logs, total] = await Promise.all([
    prisma.emergencyLog.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        nearestHospital: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.emergencyLog.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalHospitals,
    verifiedHospitals,
    totalReviews,
    totalEmergencies,
    activeEmergencies,
    recentUsers,
    emergencyByStatus,
    usersByRole,
    hospitalsByCity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.hospital.count(),
    prisma.hospital.count({ where: { isVerified: true } }),
    prisma.review.count(),
    prisma.emergencyLog.count(),
    prisma.emergencyLog.count({ where: { status: { in: ['TRIGGERED', 'RESPONDED'] } } }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.emergencyLog.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    }),
    prisma.hospital.groupBy({
      by: ['city'],
      _count: { city: true },
      orderBy: { _count: { city: 'desc' } },
      take: 10,
    }),
  ]);

  // Monthly registrations for charts (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyUsers = await prisma.user.groupBy({
    by: ['createdAt'],
    where: { createdAt: { gte: sixMonthsAgo } },
    _count: true,
  });

  // Aggregate by month
  const monthlyData: Record<string, number> = {};
  monthlyUsers.forEach((entry) => {
    const month = entry.createdAt.toISOString().slice(0, 7);
    monthlyData[month] = (monthlyData[month] || 0) + entry._count;
  });

  res.status(200).json({
    success: true,
    data: {
      counts: {
        totalUsers,
        totalHospitals,
        verifiedHospitals,
        totalReviews,
        totalEmergencies,
        activeEmergencies,
        newUsersLast30Days: recentUsers,
      },
      charts: {
        emergencyByStatus: emergencyByStatus.map((e) => ({
          status: e.status,
          count: e._count.status,
        })),
        usersByRole: usersByRole.map((u) => ({
          role: u.role,
          count: u._count.role,
        })),
        hospitalsByCity: hospitalsByCity.map((h) => ({
          city: h.city,
          count: h._count.city,
        })),
        monthlyRegistrations: Object.entries(monthlyData).map(([month, count]) => ({
          month,
          count,
        })),
      },
    },
  });
});
