import { config } from '../config';
import { logger } from '../config/logger';

interface SmsResult {
  success: boolean;
  messageId?: string;
}

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  if (config.twilio.mock) {
    logger.info(`[SMS Mock] To: ${to}, Body: ${body}`);
    return { success: true, messageId: `mock-${Date.now()}` };
  }

  try {
    // Dynamic import to avoid issues when twilio is not configured
    const twilio = await import('twilio');
    const client = twilio.default(config.twilio.accountSid, config.twilio.authToken);

    const message = await client.messages.create({
      body,
      from: config.twilio.phoneNumber,
      to,
    });

    logger.info(`SMS sent: ${message.sid} to ${to}`);
    return { success: true, messageId: message.sid };
  } catch (error) {
    logger.error('Failed to send SMS:', error);
    return { success: false };
  }
}

export async function sendOtpSms(phone: string, otp: string): Promise<SmsResult> {
  const body = `Your MedAssist Global verification code is: ${otp}. This code expires in 5 minutes. Do not share this code with anyone.`;
  return sendSms(phone, body);
}

export async function sendEmergencySms(phone: string, hospitalName: string, hospitalPhone: string): Promise<SmsResult> {
  const body = `EMERGENCY: MedAssist Global alert triggered. Nearest hospital: ${hospitalName}. Hospital phone: ${hospitalPhone}. Help is on the way.`;
  return sendSms(phone, body);
}
