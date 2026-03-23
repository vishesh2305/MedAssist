import crypto from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

export class ConsultationService {
  /**
   * Book a new consultation.
   */
  async create(
    userId: string,
    data: {
      doctorId?: string;
      hospitalId?: string;
      type: 'VIDEO' | 'AUDIO' | 'CHAT';
      scheduledAt: Date;
      notes?: string;
      amount?: number;
      currency?: string;
    }
  ) {
    try {
      // Validate doctor exists if provided
      if (data.doctorId) {
        const doctor = await prisma.doctor.findUnique({
          where: { id: data.doctorId },
        });
        if (!doctor) {
          throw ApiError.notFound('Doctor not found');
        }
        if (!doctor.isAvailable) {
          throw ApiError.badRequest('Doctor is currently unavailable');
        }
      }

      // Validate hospital exists if provided
      if (data.hospitalId) {
        const hospital = await prisma.hospital.findUnique({
          where: { id: data.hospitalId },
        });
        if (!hospital) {
          throw ApiError.notFound('Hospital not found');
        }
      }

      const roomId = this.generateRoomId();

      const consultation = await prisma.consultation.create({
        data: {
          userId,
          doctorId: data.doctorId,
          hospitalId: data.hospitalId,
          type: data.type,
          scheduledAt: data.scheduledAt,
          notes: data.notes,
          amount: data.amount,
          currency: data.currency || 'USD',
          roomId,
          status: 'SCHEDULED',
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialty: true,
              avatarUrl: true,
            },
          },
          hospital: {
            select: {
              id: true,
              name: true,
              city: true,
              country: true,
            },
          },
        },
      });

      logger.info(`Consultation ${consultation.id} created for user ${userId}`);
      return consultation;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating consultation:', error);
      throw ApiError.internal('Failed to create consultation');
    }
  }

  /**
   * List consultations for a user.
   */
  async getByUserId(userId: string) {
    const consultations = await prisma.consultation.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'desc' },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            avatarUrl: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });

    return consultations;
  }

  /**
   * Get a single consultation by ID.
   */
  async getById(id: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            specialty: true,
            qualifications: true,
            avatarUrl: true,
            consultationFee: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            country: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!consultation) {
      throw ApiError.notFound('Consultation not found');
    }

    return consultation;
  }

  /**
   * Update consultation status.
   */
  async updateStatus(
    id: string,
    status: 'SCHEDULED' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  ) {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw ApiError.notFound('Consultation not found');
    }

    const updateData: any = { status };

    if (status === 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    } else if (status === 'COMPLETED' || status === 'CANCELLED' || status === 'NO_SHOW') {
      updateData.endedAt = new Date();
      if (consultation.startedAt) {
        updateData.duration = Math.round(
          (new Date().getTime() - consultation.startedAt.getTime()) / 60000
        );
      }
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: updateData,
    });

    logger.info(`Consultation ${id} status updated to ${status}`);
    return updated;
  }

  /**
   * Generate a unique WebRTC room ID.
   */
  generateRoomId(): string {
    return `med-${crypto.randomBytes(8).toString('hex')}-${Date.now().toString(36)}`;
  }

  /**
   * Mark consultation as completed with notes and prescription.
   */
  async complete(id: string, notes?: string, prescription?: string) {
    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      throw ApiError.notFound('Consultation not found');
    }

    if (consultation.status === 'COMPLETED') {
      throw ApiError.badRequest('Consultation is already completed');
    }

    const endedAt = new Date();
    let duration: number | undefined;
    if (consultation.startedAt) {
      duration = Math.round(
        (endedAt.getTime() - consultation.startedAt.getTime()) / 60000
      );
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endedAt,
        duration,
        notes: notes || consultation.notes,
        prescription: prescription || consultation.prescription,
      },
    });

    logger.info(`Consultation ${id} completed`);
    return updated;
  }
}

export const consultationService = new ConsultationService();
