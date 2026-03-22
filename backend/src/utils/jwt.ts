import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  } as SignOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as SignOptions);
}

export function generateTokenPair(payload: TokenPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
}

export function generateEmailVerificationToken(userId: string): string {
  return jwt.sign({ userId, purpose: 'email-verification' }, config.jwt.accessSecret + '-email-verify', {
    expiresIn: '24h',
  });
}

export function verifyEmailVerificationToken(token: string): { userId: string; purpose: string } {
  return jwt.verify(token, config.jwt.accessSecret + '-email-verify') as { userId: string; purpose: string };
}

export function generatePasswordResetToken(userId: string): string {
  return jwt.sign({ userId, purpose: 'password-reset' }, config.jwt.accessSecret + '-password-reset', {
    expiresIn: '1h',
  });
}

export function verifyPasswordResetToken(token: string): { userId: string; purpose: string } {
  return jwt.verify(token, config.jwt.accessSecret + '-password-reset') as { userId: string; purpose: string };
}
