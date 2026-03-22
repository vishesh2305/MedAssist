import { Server, Socket } from 'socket.io';
import { logger } from '../config/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export function setupEmergencyHandler(io: Server, socket: AuthenticatedSocket) {
  const userId = socket.userId!;

  // Join emergency channel
  socket.on('join-emergency', (data: { emergencyId: string }) => {
    socket.join(`emergency:${data.emergencyId}`);
    logger.info(`User ${userId} joined emergency channel ${data.emergencyId}`);
  });

  // Leave emergency channel
  socket.on('leave-emergency', (data: { emergencyId: string }) => {
    socket.leave(`emergency:${data.emergencyId}`);
  });

  // Update location during emergency
  socket.on('emergency-location-update', (data: {
    emergencyId: string;
    latitude: number;
    longitude: number;
  }) => {
    io.to(`emergency:${data.emergencyId}`).emit('location-updated', {
      userId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString(),
    });
  });

  // Emergency status change broadcast
  socket.on('emergency-status-change', (data: {
    emergencyId: string;
    status: string;
    message?: string;
  }) => {
    io.to(`emergency:${data.emergencyId}`).emit('emergency-status-updated', {
      emergencyId: data.emergencyId,
      status: data.status,
      message: data.message,
      updatedBy: userId,
      timestamp: new Date().toISOString(),
    });

    // Also broadcast to admin channel
    if (socket.userRole === 'SUPER_ADMIN' || socket.userRole === 'HOSPITAL_ADMIN') {
      io.emit('admin-emergency-update', {
        emergencyId: data.emergencyId,
        status: data.status,
        updatedBy: userId,
      });
    }
  });

  // Hospital admin can broadcast to emergency
  if (socket.userRole === 'HOSPITAL_ADMIN' || socket.userRole === 'SUPER_ADMIN') {
    socket.on('emergency-response', (data: {
      emergencyId: string;
      message: string;
      estimatedArrival?: number; // minutes
    }) => {
      io.to(`emergency:${data.emergencyId}`).emit('emergency-response-received', {
        emergencyId: data.emergencyId,
        message: data.message,
        estimatedArrival: data.estimatedArrival,
        responderId: userId,
        timestamp: new Date().toISOString(),
      });
    });
  }
}
