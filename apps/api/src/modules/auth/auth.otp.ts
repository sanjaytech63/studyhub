import { createHash, randomInt } from 'node:crypto';

const OTP_LENGTH = 6;

/**
 * Generate a cryptographically secure numeric OTP.
 *
 * Example:
 * 482913
 */
export const generateOtp = (): string => {
  const minimum = 10 ** (OTP_LENGTH - 1);
  const maximum = 10 ** OTP_LENGTH;

  return randomInt(minimum, maximum).toString();
};

/**
 * Hash OTP before storing it.
 *
 * Raw OTP values must never be persisted.
 */
export const hashOtp = (otp: string): string => {
  return createHash('sha256').update(otp).digest('hex');
};

/**
 * Compare a plain OTP against its stored hash.
 */
export const verifyOtpHash = (otp: string, storedHash: string): boolean => {
  const incomingHash = hashOtp(otp);
  return incomingHash === storedHash;
};
