import { prisma } from '../config/database';
import { logger } from '../config/logger';

interface CreateNotificationInput {
  userId: string;
  title: string;
  body: string;
  type: 'EMERGENCY' | 'CHAT' | 'REVIEW' | 'SYSTEM' | 'PROMOTION' | 'APPOINTMENT';
  data?: Record<string, any>;
}

export class NotificationService {
  async createNotification(input: CreateNotificationInput) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          body: input.body,
          type: input.type,
          data: input.data || undefined,
        },
      });

      logger.info(`Notification created: ${notification.id} for user ${input.userId}`);

      // In a production system, you would also push via FCM/APNS here
      // using the user's device tokens
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string, page: number, limit: number, unreadOnly = false) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      data: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}

export const notificationService = new NotificationService();
