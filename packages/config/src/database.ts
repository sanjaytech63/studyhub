import 'dotenv/config';

const getRequiredEnv = (name: string, value: string | undefined): string => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${name} is not configured. Please check your environment configuration.`);
  }

  return normalizedValue;
};

export const databaseConfig = Object.freeze({
  url: getRequiredEnv('DATABASE_URL', process.env.DATABASE_URL),
});

export type DatabaseConfig = typeof databaseConfig;
