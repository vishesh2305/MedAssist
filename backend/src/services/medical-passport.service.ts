import crypto from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

const ENCRYPTION_KEY = process.env.QR_ENCRYPTION_KEY || 'medassist-global-qr-default-key-32!'; // 32 bytes
const IV_LENGTH = 16;
const ALGORITHM = 'aes-256-cbc';

function getKey(): Buffer {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(':');
  if (parts.length < 2) {
    throw ApiError.badRequest('Invalid encrypted data format');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts.slice(1).join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export class MedicalPassportService {
  /**
   * Create or update a user's medical passport.
   */
  async createOrUpdate(
    userId: string,
    data: {
      bloodType?: string;
      allergies?: string[];
      medications?: string[];
      conditions?: string[];
      vaccinations?: any;
      insuranceProvider?: string;
      insurancePolicyNo?: string;
      insurancePhone?: string;
      insuranceExpiry?: Date;
    }
  ) {
    try {
      const existing = await prisma.medicalPassport.findUnique({
        where: { userId },
      });

      if (existing) {
        const updated = await prisma.medicalPassport.update({
          where: { userId },
          data: {
            ...data,
            qrCodeData: null, // Invalidate QR when data changes
          },
        });
        logger.info(`Medical passport updated for user ${userId}`);
        return updated;
      }

      const created = await prisma.medicalPassport.create({
        data: {
          userId,
          ...data,
        },
      });
      logger.info(`Medical passport created for user ${userId}`);
      return created;
    } catch (error) {
      logger.error('Error creating/updating medical passport:', error);
      throw ApiError.internal('Failed to save medical passport');
    }
  }

  /**
   * Get a user's medical passport.
   */
  async getByUserId(userId: string) {
    const passport = await prisma.medicalPassport.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            nationality: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
          },
        },
      },
    });

    if (!passport) {
      throw ApiError.notFound('Medical passport not found');
    }

    return passport;
  }

  /**
   * Generate encrypted QR code data containing all medical info.
   */
  async generateQRCode(userId: string) {
    const passport = await prisma.medicalPassport.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            nationality: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
          },
        },
      },
    });

    if (!passport) {
      throw ApiError.notFound('Medical passport not found. Please create one first.');
    }

    const qrPayload = {
      version: 1,
      generated: new Date().toISOString(),
      patient: {
        name: `${passport.user.firstName} ${passport.user.lastName}`,
        nationality: passport.user.nationality,
        bloodType: passport.bloodType,
        emergencyContact: {
          name: passport.user.emergencyContactName,
          phone: passport.user.emergencyContactPhone,
        },
      },
      medical: {
        allergies: passport.allergies,
        medications: passport.medications,
        conditions: passport.conditions,
        vaccinations: passport.vaccinations,
      },
      insurance: {
        provider: passport.insuranceProvider,
        policyNo: passport.insurancePolicyNo,
        phone: passport.insurancePhone,
        expiry: passport.insuranceExpiry,
      },
    };

    const encryptedData = encrypt(JSON.stringify(qrPayload));

    // Store the QR data for reference
    await prisma.medicalPassport.update({
      where: { userId },
      data: { qrCodeData: encryptedData },
    });

    logger.info(`QR code generated for user ${userId}`);
    return {
      qrData: encryptedData,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Decode QR code data (for hospital scanning).
   */
  decodeQRCode(qrData: string) {
    try {
      const decrypted = decrypt(qrData);
      const payload = JSON.parse(decrypted);
      return payload;
    } catch (error) {
      logger.warn('Failed to decode QR code data');
      throw ApiError.badRequest('Invalid or corrupted QR code data');
    }
  }
}

export const medicalPassportService = new MedicalPassportService();
