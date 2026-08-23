import { createHash, randomInt } from 'node:crypto';

const OTP_LENGTH = 6;
const OTP_EXPIRES_IN_MINUTES = 10;

export const generateOtp = (): string => {
  const minimum = 10 ** (OTP_LENGTH - 1);
  const maximum = 10 ** OTP_LENGTH;

  return randomInt(minimum, maximum).toString();
};

export const hashOtp = (otp: string): string => {
  return createHash('sha256').update(otp).digest('hex');
};

export const verifyOtpHash = (otp: string, storedHash: string): boolean => {
  const incomingHash = hashOtp(otp);

  return incomingHash === storedHash;
};

export const getOtpExpiration = (): Date => {
  return new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);
};
