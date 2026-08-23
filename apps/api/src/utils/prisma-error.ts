import { Prisma } from '@studyhub/database';

/**
 * Determines whether an unknown error is a known Prisma request error.
 */
export const isPrismaKnownRequestError = (
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError;
};
