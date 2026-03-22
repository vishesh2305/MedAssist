import crypto from 'crypto';

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const otpStore = new Map<string, OtpEntry>();

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 3;

// Clean up expired OTPs every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of otpStore.entries()) {
    if (entry.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}, 60 * 1000);

export function generateOtp(identifier: string): string {
  const code = crypto.randomInt(100000, 999999).toString().padStart(OTP_LENGTH, '0');

  otpStore.set(identifier, {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });

  return code;
}

export function verifyOtp(identifier: string, code: string): { valid: boolean; message: string } {
  const entry = otpStore.get(identifier);

  if (!entry) {
    return { valid: false, message: 'OTP not found or expired. Please request a new one.' };
  }

  if (entry.expiresAt < Date.now()) {
    otpStore.delete(identifier);
    return { valid: false, message: 'OTP has expired. Please request a new one.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(identifier);
    return { valid: false, message: 'Too many failed attempts. Please request a new OTP.' };
  }

  if (entry.code !== code) {
    entry.attempts += 1;
    return { valid: false, message: `Invalid OTP. ${MAX_ATTEMPTS - entry.attempts} attempts remaining.` };
  }

  otpStore.delete(identifier);
  return { valid: true, message: 'OTP verified successfully.' };
}

export function getOtpForTesting(identifier: string): string | null {
  const entry = otpStore.get(identifier);
  return entry ? entry.code : null;
}
