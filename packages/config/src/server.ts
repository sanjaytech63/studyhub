import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const rootEnvPath = path.resolve(currentDirectory, '../../../.env');

dotenv.config({
  path: rootEnvPath,
});

const getRequiredEnv = (name: string, value: string | undefined): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${name} is not configured. Please check your environment configuration.`);
  }

  return normalizedValue;
};

const getOptionalEnv = (value: string | undefined): string | undefined => {
  const normalizedValue = value?.trim();

  return normalizedValue || undefined;
};

const getRequiredNumber = (name: string, value: string | undefined): number => {
  const normalizedValue = getRequiredEnv(name, value);
  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return parsedValue;
};

const getOptionalNumber = (name: string, value: string | undefined): number | undefined => {
  const normalizedValue = getOptionalEnv(value);

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number(normalizedValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`${name} must be a valid number.`);
  }

  return parsedValue;
};

const nodeEnv = process.env.NODE_ENV ?? 'development';

export const serverConfig = Object.freeze({
  app: {
    name: 'StudyHub',

    nodeEnv,

    isDevelopment: nodeEnv === 'development',
    isTest: nodeEnv === 'test',
    isProduction: nodeEnv === 'production',

    logLevel: process.env.LOG_LEVEL?.trim() || 'info',

    webUrl: getRequiredEnv('WEB_URL', process.env.WEB_URL),
    adminUrl: getRequiredEnv('ADMIN_URL', process.env.ADMIN_URL),
    apiUrl: getRequiredEnv('API_URL', process.env.API_URL),
    apiPrefix: process.env.API_PREFIX?.trim() || '/api/v1',
    port: getRequiredNumber('PORT', process.env.PORT),
  },

  database: {
    url: getRequiredEnv('DATABASE_URL', process.env.DATABASE_URL),
  },

  redis: {
    url: getRequiredEnv('REDIS_URL', process.env.REDIS_URL),
  },

  jwt: {
    accessSecret: getRequiredEnv('JWT_ACCESS_SECRET', process.env.JWT_ACCESS_SECRET),
    refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET),
    accessExpiresIn: getRequiredEnv('JWT_ACCESS_EXPIRES_IN', process.env.JWT_ACCESS_EXPIRES_IN),
    refreshExpiresIn: getRequiredEnv('JWT_REFRESH_EXPIRES_IN', process.env.JWT_REFRESH_EXPIRES_IN),
  },

  otp: {
    expiresIn: getRequiredNumber('OTP_EXPIRES_IN', process.env.OTP_EXPIRES_IN),
  },

  email: {
    host: getOptionalEnv(process.env.SMTP_HOST),
    port: getOptionalNumber('SMTP_PORT', process.env.SMTP_PORT),
    user: getOptionalEnv(process.env.SMTP_USER),
    password: getOptionalEnv(process.env.SMTP_PASSWORD),
    from: getOptionalEnv(process.env.SMTP_FROM),
  },

  cloudinary: {
    cloudName: getOptionalEnv(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: getOptionalEnv(process.env.CLOUDINARY_API_KEY),
    apiSecret: getOptionalEnv(process.env.CLOUDINARY_API_SECRET),
  },

  aws: {
    region: getOptionalEnv(process.env.AWS_REGION),
    accessKeyId: getOptionalEnv(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: getOptionalEnv(process.env.AWS_SECRET_ACCESS_KEY),
  },

  security: {
    corsOrigins: getRequiredEnv('CORS_ORIGIN', process.env.CORS_ORIGIN)
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),

    trustProxy: 1,
  },
});

export type ServerConfig = typeof serverConfig;
