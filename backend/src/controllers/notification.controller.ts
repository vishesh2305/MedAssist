import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { notificationService } from '../services/notification.service';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const unreadOnly = req.query.unreadOnly === 'true';

  const result = await notificationService.getUserNotifications(
    req.user!.userId,
    page,
    limit,
    unreadOnly
  );

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await notificationService.markAsRead(id, req.user!.userId);

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user!.userId);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});
