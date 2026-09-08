import { PrismaPg } from '@prisma/adapter-pg';
import { serverConfig } from '@studyhub/config/server';
import { PrismaClient } from './generated/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const needsSsl =
  serverConfig.app.isProduction ||
  serverConfig.database.url.includes('rds.amazonaws.com') ||
  serverConfig.database.url.includes('sslmode=require');

const adapter = new PrismaPg({
  connectionString: serverConfig.database.url,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (serverConfig.app.isDevelopment) {
  globalForPrisma.prisma = prisma;
}

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};
