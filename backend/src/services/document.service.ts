import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export class DocumentService {
  /**
   * Upload a medical document.
   */
  async upload(
    userId: string,
    file: {
      originalname: string;
      buffer: Buffer;
      mimetype: string;
      size: number;
    },
    metadata: {
      title: string;
      type: string;
      description?: string;
    }
  ) {
    try {
      // Generate unique filename
      const ext = path.extname(file.originalname);
      const filename = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, filename);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      const document = await prisma.medicalDocument.create({
        data: {
          userId,
          title: metadata.title,
          type: metadata.type as any,
          fileUrl: `/uploads/${filename}`,
          fileSize: file.size,
          mimeType: file.mimetype,
          description: metadata.description,
          metadata: {},
        },
      });

      logger.info(`Document uploaded: ${document.id} for user ${userId}`);
      return document;
    } catch (error) {
      logger.error('Error uploading document:', error);
      throw ApiError.internal('Failed to upload document');
    }
  }

  /**
   * List user's documents.
   */
  async getByUserId(userId: string) {
    const documents = await prisma.medicalDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return documents;
  }

  /**
   * Get a single document by ID.
   */
  async getById(docId: string, userId: string) {
    const document = await prisma.medicalDocument.findFirst({
      where: { id: docId, userId },
    });

    if (!document) {
      throw ApiError.notFound('Document not found');
    }

    return document;
  }

  /**
   * Generate a temporary share link with token.
   */
  async generateShareLink(docId: string, userId: string, expiryHours: number = 24) {
    const document = await prisma.medicalDocument.findFirst({
      where: { id: docId, userId },
    });

    if (!document) {
      throw ApiError.notFound('Document not found');
    }

    const shareToken = crypto.randomBytes(32).toString('hex');
    const shareExpiry = new Date();
    shareExpiry.setHours(shareExpiry.getHours() + expiryHours);

    const updated = await prisma.medicalDocument.update({
      where: { id: docId },
      data: {
        shareToken,
        shareExpiry,
      },
    });

    logger.info(`Share link generated for document ${docId}`);
    return {
      shareToken: updated.shareToken,
      shareExpiry: updated.shareExpiry,
      shareUrl: `/api/v1/documents/shared/${updated.shareToken}`,
    };
  }

  /**
   * Access a shared document by token (public).
   */
  async getByShareToken(token: string) {
    const document = await prisma.medicalDocument.findFirst({
      where: { shareToken: token },
    });

    if (!document) {
      throw ApiError.notFound('Shared document not found or link has expired');
    }

    if (document.shareExpiry && new Date() > document.shareExpiry) {
      // Invalidate expired token
      await prisma.medicalDocument.update({
        where: { id: document.id },
        data: { shareToken: null, shareExpiry: null },
      });
      throw ApiError.badRequest('Share link has expired');
    }

    return document;
  }

  /**
   * Delete a document.
   */
  async delete(docId: string, userId: string) {
    const document = await prisma.medicalDocument.findFirst({
      where: { id: docId, userId },
    });

    if (!document) {
      throw ApiError.notFound('Document not found');
    }

    // Delete file from disk
    try {
      const filename = path.basename(document.fileUrl);
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      logger.warn(`Could not delete file for document ${docId}:`, err);
    }

    await prisma.medicalDocument.delete({
      where: { id: docId },
    });

    logger.info(`Document deleted: ${docId} for user ${userId}`);
    return { success: true };
  }
}

export const documentService = new DocumentService();
