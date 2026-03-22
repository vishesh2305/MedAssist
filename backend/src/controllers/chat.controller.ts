import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../config/database';

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, hospitalId } = req.body;

  // If hospital ID is provided, verify it exists
  if (hospitalId) {
    const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital) {
      throw ApiError.notFound('Hospital not found');
    }
  }

  // Check for existing active room of same type with same hospital
  if (hospitalId) {
    const existingRoom = await prisma.chatRoom.findFirst({
      where: {
        userId: req.user!.userId,
        hospitalId,
        type: type || 'SUPPORT',
        isActive: true,
      },
    });

    if (existingRoom) {
      res.status(200).json({
        success: true,
        message: 'Existing chat room found',
        data: existingRoom,
      });
      return;
    }
  }

  const room = await prisma.chatRoom.create({
    data: {
      name: name || `Chat ${Date.now()}`,
      type: type || 'SUPPORT',
      userId: req.user!.userId,
      hospitalId,
    },
    include: {
      hospital: {
        select: { id: true, name: true, coverImage: true },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: 'Chat room created',
    data: room,
  });
});

export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  let whereClause: any;
  if (userRole === 'SUPER_ADMIN') {
    // Super admins can see all rooms
    whereClause = {};
  } else if (userRole === 'HOSPITAL_ADMIN') {
    // Hospital admins can see their own rooms and rooms for their hospital
    whereClause = {
      OR: [
        { userId },
        { hospital: { adminUserId: userId } },
      ],
    };
  } else {
    // Regular users can only see their own rooms
    whereClause = { userId };
  }

  const rooms = await prisma.chatRoom.findMany({
    where: whereClause,
    include: {
      hospital: {
        select: { id: true, name: true, coverImage: true },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          content: true,
          createdAt: true,
          senderRole: true,
          messageType: true,
        },
      },
      _count: {
        select: {
          messages: { where: { isRead: false, senderId: { not: userId } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const data = rooms.map((room) => ({
    ...room,
    lastMessage: room.messages[0] || null,
    unreadCount: room._count.messages,
    messages: undefined,
    _count: undefined,
  }));

  res.status(200).json({
    success: true,
    data,
  });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const room = await prisma.chatRoom.findFirst({
    where: { id, userId: req.user!.userId },
  });

  if (!room) {
    // Also allow hospital admin to view their hospital's chat rooms
    const hospitalRoom = await prisma.chatRoom.findFirst({
      where: {
        id,
        hospital: { adminUserId: req.user!.userId },
      },
    });

    if (!hospitalRoom && req.user!.role !== 'SUPER_ADMIN') {
      throw ApiError.notFound('Chat room not found');
    }
  }

  const [messages, total] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { chatRoomId: id },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.chatMessage.count({ where: { chatRoomId: id } }),
  ]);

  // Mark messages as read
  await prisma.chatMessage.updateMany({
    where: {
      chatRoomId: id,
      senderId: { not: req.user!.userId },
      isRead: false,
    },
    data: { isRead: true },
  });

  res.status(200).json({
    success: true,
    data: messages.reverse(), // Return in chronological order
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, messageType, translatedContent } = req.body;

  // Verify room access
  const room = await prisma.chatRoom.findFirst({
    where: {
      id,
      OR: [
        { userId: req.user!.userId },
        { hospital: { adminUserId: req.user!.userId } },
      ],
    },
  });

  if (!room && req.user!.role !== 'SUPER_ADMIN') {
    throw ApiError.notFound('Chat room not found');
  }

  // Determine sender role
  let senderRole: 'USER' | 'HOSPITAL' | 'ADMIN' | 'SYSTEM' = 'USER';
  if (req.user!.role === 'HOSPITAL_ADMIN') senderRole = 'HOSPITAL';
  if (req.user!.role === 'SUPER_ADMIN') senderRole = 'ADMIN';

  const message = await prisma.chatMessage.create({
    data: {
      chatRoomId: id,
      senderId: req.user!.userId,
      senderRole,
      content,
      translatedContent,
      messageType: messageType || 'TEXT',
    },
    include: {
      sender: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  });

  // Reactivate room if it was inactive
  if (room && !room.isActive) {
    await prisma.chatRoom.update({
      where: { id },
      data: { isActive: true },
    });
  }

  res.status(201).json({
    success: true,
    data: message,
  });
});
