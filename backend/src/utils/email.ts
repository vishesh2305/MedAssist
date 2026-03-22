import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../config/logger';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let transporter: nodemailer.Transporter;

if (config.env === 'production') {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
} else {
  // In dev, use ethereal or just log
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info(`Email sent: ${info.messageId} to ${options.to}`);
    return true;
  } catch (error) {
    logger.error('Failed to send email:', error);
    // Don't throw in dev - just log
    if (config.env === 'production') {
      throw error;
    }
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Verify Your Email - MedAssist Global',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">MedAssist Global</h1>
        <h2>Verify Your Email Address</h2>
        <p>Thank you for registering with MedAssist Global. Please click the button below to verify your email address.</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
        <p>This link expires in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  return sendEmail({
    to: email,
    subject: 'Reset Your Password - MedAssist Global',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">MedAssist Global</h1>
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link in your browser:</p>
        <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendEmergencyNotificationEmail(
  email: string,
  userName: string,
  hospitalName: string
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'EMERGENCY ALERT - MedAssist Global',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">EMERGENCY ALERT</h1>
        <p>An emergency has been triggered by <strong>${escapeHtml(userName)}</strong>.</p>
        <p>Nearest hospital identified: <strong>${escapeHtml(hospitalName)}</strong></p>
        <p>Please check the MedAssist Global app for real-time updates.</p>
      </div>
    `,
  });
}
