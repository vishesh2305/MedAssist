import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId, rating, title, content } = req.body;

  // Check hospital exists
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  // Check if user already reviewed this hospital
  const existingReview = await prisma.review.findFirst({
    where: {
      userId: req.user!.userId,
      hospitalId,
    },
  });

  if (existingReview) {
    throw ApiError.conflict('You have already reviewed this hospital. Please update your existing review.');
  }

  // Auto-verify if user has previously viewed the hospital (simulating "visited")
  const hasViewed = await prisma.recentlyViewed.findUnique({
    where: {
      userId_hospitalId: {
        userId: req.user!.userId,
        hospitalId,
      },
    },
  });

  const review = await prisma.review.create({
    data: {
      hospitalId,
      userId: req.user!.userId,
      rating,
      title,
      content,
      isVerified: !!hasViewed,
      isApproved: false, // Requires admin approval
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  });

  // Note: since this review isn't approved yet, we don't update the rating now
  // Rating gets updated when admin approves the review

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully. It will be visible after admin approval.',
    data: review,
  });
});

export const getByHospital = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;

  const hospital = await prisma.hospital.findUnique({ where: { id } });
  if (!hospital) {
    throw ApiError.notFound('Hospital not found');
  }

  const [reviews, total, aggregation] = await Promise.all([
    prisma.review.findMany({
      where: { hospitalId: id, isApproved: true },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true, nationality: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { hospitalId: id, isApproved: true } }),
    prisma.review.aggregate({
      where: { hospitalId: id, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    }),
  ]);

  // Rating distribution
  const ratingDistribution = await prisma.review.groupBy({
    by: ['rating'],
    where: { hospitalId: id, isApproved: true },
    _count: { rating: true },
  });

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingDistribution.forEach((r) => {
    distribution[r.rating] = r._count.rating;
  });

  res.status(200).json({
    success: true,
    data: reviews,
    summary: {
      averageRating: aggregation._avg.rating ? Math.round(aggregation._avg.rating * 10) / 10 : 0,
      totalReviews: aggregation._count.rating,
      ratingDistribution: distribution,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId !== req.user!.userId && req.user!.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('You can only edit your own reviews');
  }

  const updated = await prisma.review.update({
    where: { id },
    data: {
      ...req.body,
      isApproved: false, // Re-submit for approval after edit
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  });

  res.status(200).json({
    success: true,
    message: 'Review updated. It will be re-reviewed by admin.',
    data: updated,
  });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    throw ApiError.notFound('Review not found');
  }

  if (review.userId !== req.user!.userId && req.user!.role !== 'SUPER_ADMIN') {
    throw ApiError.forbidden('You can only delete your own reviews');
  }

  await prisma.review.delete({ where: { id } });

  // Recalculate hospital rating
  const aggregation = await prisma.review.aggregate({
    where: { hospitalId: review.hospitalId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.hospital.update({
    where: { id: review.hospitalId },
    data: {
      rating: aggregation._avg.rating || 0,
      reviewCount: aggregation._count.rating,
    },
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully',
  });
});
