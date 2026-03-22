import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MedAssist Global API',
      version: '1.0.0',
      description: 'Tourist Medical Assistance Platform API Documentation',
      contact: {
        name: 'MedAssist Global Support',
        email: 'support@medassistglobal.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}${config.apiPrefix}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: { type: 'integer' },
            limit: { type: 'integer' },
            total: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            nationality: { type: 'string' },
            preferredLanguage: { type: 'string' },
            travelStatus: { type: 'string', enum: ['TOURIST', 'LOCAL'] },
            role: { type: 'string', enum: ['TRAVELER', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'] },
            emailVerified: { type: 'boolean' },
            avatarUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Hospital: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            phone: { type: 'string' },
            email: { type: 'string' },
            website: { type: 'string' },
            isVerified: { type: 'boolean' },
            isEmergencyCapable: { type: 'boolean' },
            availabilityStatus: { type: 'string', enum: ['OPEN', 'CLOSED', 'LIMITED'] },
            rating: { type: 'number' },
            reviewCount: { type: 'integer' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            hospitalId: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            title: { type: 'string' },
            content: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        EmergencyLog: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            status: { type: 'string', enum: ['TRIGGERED', 'RESPONDED', 'RESOLVED', 'CANCELLED'] },
            ambulanceCalled: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ChatRoom: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['SUPPORT', 'EMERGENCY', 'CONSULTATION'] },
            isActive: { type: 'boolean' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            body: { type: 'string' },
            type: { type: 'string' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
