import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { emergencyService } from '../services/emergency.service';

export const trigger = asyncHandler(async (req: Request, res: Response) => {
  const { latitude, longitude, notes } = req.body;

  const result = await emergencyService.triggerEmergency(
    req.user!.userId,
    latitude,
    longitude,
    notes
  );

  res.status(201).json({
    success: true,
    message: 'Emergency triggered. Help is on the way.',
    data: result,
  });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, ambulanceCalled, notes } = req.body;

  const updated = await emergencyService.updateStatus(
    id,
    req.user!.userId,
    status,
    ambulanceCalled,
    notes,
    req.user!.role
  );

  if (!updated) {
    throw ApiError.notFound('Emergency log not found');
  }

  res.status(200).json({
    success: true,
    message: 'Emergency status updated',
    data: updated,
  });
});

export const getActive = asyncHandler(async (req: Request, res: Response) => {
  const emergencies = await emergencyService.getActiveEmergencies(req.user!.userId);

  res.status(200).json({
    success: true,
    data: emergencies,
  });
});

export const getHistory = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await emergencyService.getHistory(req.user!.userId, page, limit);

  res.status(200).json({
    success: true,
    ...result,
  });
});
