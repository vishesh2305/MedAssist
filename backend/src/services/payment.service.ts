import crypto from 'crypto';
import { prisma } from '../config/database';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Mock Stripe-like interface for when Stripe SDK is not available.
 * In production, replace with actual Stripe SDK calls.
 */
function createMockPaymentIntent(amount: number, currency: string, metadata: Record<string, string>) {
  const id = `pi_mock_${crypto.randomBytes(12).toString('hex')}`;
  const clientSecret = `${id}_secret_${crypto.randomBytes(16).toString('hex')}`;

  return {
    id,
    client_secret: clientSecret,
    amount: Math.round(amount * 100), // cents
    currency: currency.toLowerCase(),
    status: 'requires_payment_method',
    metadata,
  };
}

export class PaymentService {
  /**
   * Create a payment intent (Stripe-compatible).
   */
  async createPaymentIntent(
    userId: string,
    amount: number,
    currency: string = 'USD',
    metadata: {
      consultationId?: string;
      hospitalId?: string;
      description?: string;
    } = {}
  ) {
    try {
      if (amount <= 0) {
        throw ApiError.badRequest('Amount must be greater than 0');
      }

      let paymentIntent: any;

      if (STRIPE_SECRET_KEY) {
        // Use real Stripe SDK if key is configured
        try {
          const stripe = require('stripe')(STRIPE_SECRET_KEY);
          paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            metadata: {
              userId,
              ...metadata,
            },
          });
        } catch (stripeErr: any) {
          logger.error('Stripe error:', stripeErr.message);
          throw ApiError.internal('Payment provider error');
        }
      } else {
        // Mock mode
        logger.warn('Using mock payment intent (STRIPE_SECRET_KEY not set)');
        paymentIntent = createMockPaymentIntent(amount, currency, {
          userId,
          ...metadata,
        } as Record<string, string>);
      }

      // Store payment record
      const payment = await prisma.payment.create({
        data: {
          userId,
          amount,
          currency: currency.toUpperCase(),
          status: 'PENDING',
          provider: 'stripe',
          providerPaymentId: paymentIntent.id,
          consultationId: metadata.consultationId,
          hospitalId: metadata.hospitalId,
          description: metadata.description,
          metadata: {
            clientSecret: paymentIntent.client_secret,
          },
        },
      });

      logger.info(`Payment intent created: ${payment.id} for user ${userId}`);

      return {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret,
        providerPaymentId: paymentIntent.id,
        amount,
        currency: currency.toUpperCase(),
        status: payment.status,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error creating payment intent:', error);
      throw ApiError.internal('Failed to create payment');
    }
  }

  /**
   * Handle Stripe webhook events.
   */
  async handleWebhook(payload: any, signature?: string) {
    try {
      let event: any;

      if (STRIPE_SECRET_KEY && STRIPE_WEBHOOK_SECRET && signature) {
        try {
          const stripe = require('stripe')(STRIPE_SECRET_KEY);
          event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
          logger.error('Webhook signature verification failed:', err.message);
          throw ApiError.badRequest('Invalid webhook signature');
        }
      } else {
        // In mock/development mode, accept the payload as-is
        event = typeof payload === 'string' ? JSON.parse(payload) : payload;
      }

      const eventType = event.type || event.eventType;
      const paymentIntentId = event.data?.object?.id || event.providerPaymentId;

      if (!paymentIntentId) {
        logger.warn('Webhook event without payment intent ID');
        return { received: true };
      }

      switch (eventType) {
        case 'payment_intent.succeeded': {
          await prisma.payment.updateMany({
            where: { providerPaymentId: paymentIntentId },
            data: {
              status: 'COMPLETED',
              receiptUrl: event.data?.object?.charges?.data?.[0]?.receipt_url || null,
            },
          });
          logger.info(`Payment succeeded: ${paymentIntentId}`);
          break;
        }

        case 'payment_intent.payment_failed': {
          await prisma.payment.updateMany({
            where: { providerPaymentId: paymentIntentId },
            data: { status: 'FAILED' },
          });
          logger.info(`Payment failed: ${paymentIntentId}`);
          break;
        }

        case 'payment_intent.processing': {
          await prisma.payment.updateMany({
            where: { providerPaymentId: paymentIntentId },
            data: { status: 'PROCESSING' },
          });
          break;
        }

        default:
          logger.debug(`Unhandled webhook event type: ${eventType}`);
      }

      return { received: true, eventType };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error processing webhook:', error);
      throw ApiError.internal('Failed to process webhook');
    }
  }

  /**
   * Get payment history for a user.
   */
  async getByUserId(userId: string) {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return payments;
  }

  /**
   * Refund a payment.
   */
  async refund(paymentId: string, reason?: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }

    if (payment.status === 'REFUNDED') {
      throw ApiError.badRequest('Payment has already been refunded');
    }

    if (payment.status !== 'COMPLETED') {
      throw ApiError.badRequest('Only completed payments can be refunded');
    }

    try {
      if (STRIPE_SECRET_KEY && payment.providerPaymentId) {
        const stripe = require('stripe')(STRIPE_SECRET_KEY);
        await stripe.refunds.create({
          payment_intent: payment.providerPaymentId,
          reason: reason || 'requested_by_customer',
        });
      } else {
        logger.warn(`Mock refund for payment ${paymentId}`);
      }

      const updated = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          metadata: {
            ...(payment.metadata as any || {}),
            refundReason: reason,
            refundedAt: new Date().toISOString(),
          },
        },
      });

      logger.info(`Payment ${paymentId} refunded`);
      return updated;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      logger.error('Error processing refund:', error);
      throw ApiError.internal('Failed to process refund');
    }
  }
}

export const paymentService = new PaymentService();
