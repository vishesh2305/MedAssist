import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import hpp from 'hpp';
import swaggerUi from 'swagger-ui-express';

import { config } from './config';
import { logger, morganStream } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { setupSocketIO } from './socket';
import routes from './routes';

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  // Setup Socket.IO
  const io = setupSocketIO(server);

  // Make io available on request if needed
  app.set('io', io);

  // ─── Security Middleware ──────────────────────────────
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(hpp());
  app.use(cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ─── General Middleware ───────────────────────────────
  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(morgan('combined', { stream: morganStream }));
  app.use(generalLimiter);

  // ─── Swagger Documentation ───────────────────────────
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MedAssist Global API Docs',
  }));

  // Serve swagger spec as JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // ─── API Routes ──────────────────────────────────────
  app.use(config.apiPrefix, routes);

  // ─── Root route ──────────────────────────────────────
  app.get('/', (_req, res) => {
    res.json({
      name: 'MedAssist Global API',
      version: '1.0.0',
      docs: '/api-docs',
      health: `${config.apiPrefix}/health`,
    });
  });

  // ─── Error Handling ──────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  // ─── Connect Database ────────────────────────────────
  await connectDatabase();

  // ─── Start Server ────────────────────────────────────
  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.env} mode`);
    logger.info(`API: http://localhost:${config.port}${config.apiPrefix}`);
    logger.info(`Docs: http://localhost:${config.port}/api-docs`);
    logger.info(`Health: http://localhost:${config.port}${config.apiPrefix}/health`);
  });

  // ─── Graceful Shutdown ───────────────────────────────
  const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed');

      // Close Socket.IO
      io.close(() => {
        logger.info('Socket.IO closed');
      });

      // Disconnect database
      await disconnectDatabase();

      logger.info('Graceful shutdown complete');
      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection:', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
