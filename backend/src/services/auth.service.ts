import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateTokenPair,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
  verifyRefreshToken,
  TokenPair,
} from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { generateOtp, verifyOtp as verifyOtpUtil } from '../utils/otp';
import { sendOtpSms } from '../utils/sms';
import { ApiError } from '../utils/ApiError';
import { SignupInput, LoginInput } from '../validators/auth';
import { logger } from '../config/logger';
import { config } from '../config';

export class AuthService {
  async signup(input: SignupInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw ApiError.conflict('An account with this email already exists');
    }

    if (input.phone) {
      const phoneExists = await prisma.user.findUnique({
        where: { phone: input.phone },
      });
      if (phoneExists) {
        throw ApiError.conflict('An account with this phone number already exists');
      }
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        nationality: input.nationality,
        preferredLanguage: input.preferredLanguage,
        travelStatus: input.travelStatus,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        nationality: true,
        preferredLanguage: true,
        travelStatus: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // In development, auto-verify email for easier testing
    if (config.env !== 'production') {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
      user.emailVerified = true;
    } else {
      // Generate verification token and send email (non-blocking)
      try {
        const verificationToken = generateEmailVerificationToken(user.id);
        await sendVerificationEmail(user.email, verificationToken);
      } catch (err) {
        logger.warn(`Failed to send verification email to ${user.email}: ${err}`);
      }
    }

    // Generate tokens (returned in both dev and production so user can access limited features)
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, tokens };
  }

  async login(input: LoginInput, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.emailVerified) {
      // Resend verification email
      const verificationToken = generateEmailVerificationToken(user.id);
      await sendVerificationEmail(user.email, verificationToken);
      throw ApiError.forbidden('Please verify your email before logging in. A new verification email has been sent.');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        deviceInfo: input.deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async loginPhone(phone: string) {
    const otp = generateOtp(phone);
    await sendOtpSms(phone, otp);
    logger.info(`OTP generated for phone: ${phone}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, otp: string, deviceInfo?: string, ipAddress?: string) {
    const result = verifyOtpUtil(phone, otp);

    if (!result.valid) {
      throw ApiError.badRequest(result.message);
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `${phone.replace(/\+/g, '')}@phone.medassist.temp`,
          phone,
          passwordHash: await hashPassword(Math.random().toString(36).slice(-12)),
          firstName: 'User',
          lastName: phone.slice(-4),
          phoneVerified: true,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { phoneVerified: true },
      });
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        deviceInfo,
        ipAddress,
        expiresAt,
      },
    });

    const { passwordHash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, tokens };
  }

  async verifyEmail(token: string) {
    try {
      const payload = verifyEmailVerificationToken(token);

      if (payload.purpose !== 'email-verification') {
        throw ApiError.badRequest('Invalid verification token');
      }

      const user = await prisma.user.update({
        where: { id: payload.userId },
        data: { emailVerified: true },
        select: {
          id: true,
          email: true,
          emailVerified: true,
        },
      });

      return { user, message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.badRequest('Invalid or expired verification token');
    }
  }

  async refreshToken(refreshToken: string): Promise<{ tokens: TokenPair }> {
    try {
      const payload = verifyRefreshToken(refreshToken);

      // Find session with this refresh token
      const session = await prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      if (session.expiresAt < new Date()) {
        await prisma.session.delete({ where: { id: session.id } });
        throw ApiError.unauthorized('Session expired');
      }

      // Generate new token pair
      const tokens = generateTokenPair({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      // Update session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
        },
      });

      return { tokens };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.unauthorized('Invalid refresh token');
    }
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal whether user exists
    if (!user) {
      return { message: 'If an account with that email exists, a password reset link has been sent.' };
    }

    try {
      const resetToken = generatePasswordResetToken(user.id);
      await sendPasswordResetEmail(email, resetToken);
    } catch (err) {
      logger.warn(`Failed to send password reset email to ${email}: ${err}`);
    }

    return { message: 'If an account with that email exists, a password reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = verifyPasswordResetToken(token);

      if (payload.purpose !== 'password-reset') {
        throw ApiError.badRequest('Invalid reset token');
      }

      const passwordHash = await hashPassword(newPassword);

      await prisma.user.update({
        where: { id: payload.userId },
        data: { passwordHash },
      });

      // Invalidate all sessions
      await prisma.session.deleteMany({
        where: { userId: payload.userId },
      });

      return { message: 'Password reset successfully. Please log in with your new password.' };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw ApiError.badRequest('Invalid or expired reset token');
    }
  }

  async logout(userId: string, token: string) {
    await prisma.session.deleteMany({
      where: {
        userId,
        token,
      },
    });

    return { message: 'Logged out successfully' };
  }
}

export const authService = new AuthService();
