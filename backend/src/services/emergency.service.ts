import { prisma } from '../config/database';
import { hospitalService } from './hospital.service';
import { notificationService } from './notification.service';
import { sendEmergencySms } from '../utils/sms';
import { sendEmergencyNotificationEmail } from '../utils/email';
import { logger } from '../config/logger';

export class EmergencyService {
  async triggerEmergency(userId: string, latitude: number, longitude: number, notes?: string) {
    // Find nearest emergency-capable hospital
    const nearestHospitals = await hospitalService.findNearestHospitals(latitude, longitude, 3);

    if (nearestHospitals.length === 0) {
      logger.warn(`No nearby hospitals found for emergency at ${latitude}, ${longitude}`);
    }

    const nearestHospital = nearestHospitals[0] || null;

    // Create emergency log
    const emergencyLog = await prisma.emergencyLog.create({
      data: {
        userId,
        latitude,
        longitude,
        status: 'TRIGGERED',
        nearestHospitalId: nearestHospital?.id || null,
        notes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            emergencyContactPhone: true,
            emergencyContactName: true,
            medicalNotes: true,
          },
        },
        nearestHospital: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            phone: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    // Send notifications asynchronously
    this.sendEmergencyNotifications(emergencyLog).catch((err) => {
      logger.error('Failed to send emergency notifications:', err);
    });

    return {
      emergencyLog,
      nearestHospitals: nearestHospitals.slice(0, 3),
    };
  }

  private async sendEmergencyNotifications(emergencyLog: any) {
    const user = emergencyLog.user;
    const hospital = emergencyLog.nearestHospital;

    // Notify user's emergency contact
    if (user.emergencyContactPhone) {
      await sendEmergencySms(
        user.emergencyContactPhone,
        hospital?.name || 'Unknown',
        hospital?.phone || 'N/A'
      );
    }

    // Send in-app notification
    await notificationService.createNotification({
      userId: user.id,
      title: 'Emergency Alert Triggered',
      body: `Emergency triggered. Nearest hospital: ${hospital?.name || 'Searching...'}. Help is on the way.`,
      type: 'EMERGENCY',
      data: {
        emergencyLogId: emergencyLog.id,
        hospitalId: hospital?.id,
        hospitalName: hospital?.name,
        hospitalPhone: hospital?.phone,
      },
    });

    // Notify hospital admin if exists
    if (hospital) {
      const hospitalRecord = await prisma.hospital.findUnique({
        where: { id: hospital.id },
        select: { adminUserId: true },
      });

      if (hospitalRecord?.adminUserId) {
        await notificationService.createNotification({
          userId: hospitalRecord.adminUserId,
          title: 'Incoming Emergency',
          body: `Emergency patient ${user.firstName} ${user.lastName} is heading to your facility.`,
          type: 'EMERGENCY',
          data: {
            emergencyLogId: emergencyLog.id,
            patientId: user.id,
            patientName: `${user.firstName} ${user.lastName}`,
            medicalNotes: user.medicalNotes,
          },
        });
      }
    }

    // Send email notification
    if (user.email) {
      await sendEmergencyNotificationEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        hospital?.name || 'Searching for nearest hospital...'
      );
    }
  }

  async updateStatus(
    emergencyId: string,
    userId: string,
    status: 'TRIGGERED' | 'RESPONDED' | 'RESOLVED' | 'CANCELLED',
    ambulanceCalled?: boolean,
    notes?: string,
    userRole?: string
  ) {
    let emergency;

    if (userRole === 'SUPER_ADMIN' || userRole === 'HOSPITAL_ADMIN') {
      // Admins can update any emergency
      emergency = await prisma.emergencyLog.findFirst({
        where: { id: emergencyId },
      });
    } else {
      // Travelers can only update their own emergencies
      emergency = await prisma.emergencyLog.findFirst({
        where: { id: emergencyId, userId },
      });
    }

    if (!emergency) {
      return null;
    }

    const updateData: any = { status };
    if (status === 'RESOLVED' || status === 'CANCELLED') {
      updateData.resolvedAt = new Date();
    }
    if (ambulanceCalled !== undefined) {
      updateData.ambulanceCalled = ambulanceCalled;
    }
    if (notes) {
      updateData.notes = notes;
    }

    return prisma.emergencyLog.update({
      where: { id: emergencyId },
      data: updateData,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
        nearestHospital: {
          select: { id: true, name: true, phone: true, address: true },
        },
      },
    });
  }

  async getActiveEmergencies(userId: string) {
    return prisma.emergencyLog.findMany({
      where: {
        userId,
        status: { in: ['TRIGGERED', 'RESPONDED'] },
      },
      include: {
        nearestHospital: {
          select: { id: true, name: true, phone: true, address: true, latitude: true, longitude: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.emergencyLog.findMany({
        where: { userId },
        include: {
          nearestHospital: {
            select: { id: true, name: true, city: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.emergencyLog.count({ where: { userId } }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const emergencyService = new EmergencyService();
