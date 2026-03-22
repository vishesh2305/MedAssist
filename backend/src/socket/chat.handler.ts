import { Server, Socket } from 'socket.io';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export function setupChatHandler(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.userId!;

  // Join a chat room
  socket.on('join-room', async (data: { roomId: string }) => {
    try {
      const { roomId } = data;

      // Verify user has access to this room
      const room = await prisma.chatRoom.findFirst({
        where: {
          id: roomId,
          OR: [
            { userId },
            { hospital: { adminUserId: userId } },
          ],
        },
      });

      if (!room && socket.userRole !== 'SUPER_ADMIN') {
        socket.emit('error', { message: 'Access denied to this chat room' });
        return;
      }

      socket.join(`chat:${roomId}`);
      logger.info(`User ${userId} joined chat room ${roomId}`);

      // Mark messages as read
      await prisma.chatMessage.updateMany({
        where: {
          chatRoomId: roomId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      });

      socket.emit('room-joined', { roomId });
    } catch (error) {
      logger.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Leave a chat room
  socket.on('leave-room', (data: { roomId: string }) => {
    socket.leave(`chat:${data.roomId}`);
    logger.info(`User ${userId} left chat room ${data.roomId}`);
  });

  // Send a message
  socket.on('send-message', async (data: {
    roomId: string;
    content: string;
    messageType?: string;
    translatedContent?: string;
  }) => {
    try {
      const { roomId, content, messageType, translatedContent } = data;

      // Verify access
      const room = await prisma.chatRoom.findFirst({
        where: {
          id: roomId,
          OR: [
            { userId },
            { hospital: { adminUserId: userId } },
          ],
        },
      });

      if (!room && socket.userRole !== 'SUPER_ADMIN') {
        socket.emit('error', { message: 'Access denied' });
        return;
      }

      // Determine sender role
      let senderRole: 'USER' | 'HOSPITAL' | 'ADMIN' | 'SYSTEM' = 'USER';
      if (socket.userRole === 'HOSPITAL_ADMIN') senderRole = 'HOSPITAL';
      if (socket.userRole === 'SUPER_ADMIN') senderRole = 'ADMIN';

      const message = await prisma.chatMessage.create({
        data: {
          chatRoomId: roomId,
          senderId: userId,
          senderRole,
          content,
          translatedContent,
          messageType: (messageType as any) || 'TEXT',
        },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
      });

      // Broadcast to room
      io.to(`chat:${roomId}`).emit('new-message', message);

      // Notify room participants who aren't in the room
      if (room) {
        const recipientId = room.userId === userId ? null : room.userId;
        if (recipientId) {
          io.to(`user:${recipientId}`).emit('message-notification', {
            roomId,
            message: {
              id: message.id,
              content: message.content,
              senderName: `${message.sender.firstName} ${message.sender.lastName}`,
              createdAt: message.createdAt,
            },
          });
        }
      }
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', (data: { roomId: string; isTyping: boolean }) => {
    socket.to(`chat:${data.roomId}`).emit('user-typing', {
      userId,
      roomId: data.roomId,
      isTyping: data.isTyping,
    });
  });

  // Mark messages as read
  socket.on('mark-read', async (data: { roomId: string }) => {
    try {
      await prisma.chatMessage.updateMany({
        where: {
          chatRoomId: data.roomId,
          senderId: { not: userId },
          isRead: false,
        },
        data: { isRead: true },
      });

      socket.to(`chat:${data.roomId}`).emit('messages-read', {
        roomId: data.roomId,
        readBy: userId,
      });
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  });
}
