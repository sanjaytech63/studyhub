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

export const serverConfig = Object.freeze({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    webUrl: getRequiredEnv('WEB_URL', process.env.WEB_URL),
    adminUrl: getRequiredEnv('ADMIN_URL', process.env.ADMIN_URL),
    apiUrl: getRequiredEnv('API_URL', process.env.API_URL),
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
    expiresIn: Number(getRequiredEnv('OTP_EXPIRES_IN', process.env.OTP_EXPIRES_IN)),
  },

  email: {
    host: getOptionalEnv(process.env.SMTP_HOST),
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
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
    corsOrigin: getRequiredEnv('CORS_ORIGIN', process.env.CORS_ORIGIN),
  },
} as const);
