import { AppError } from '@/errors/app-error';
import { ERROR_CODES } from '@/errors/error-codes';
import { HTTP_STATUS } from '@/utils/http-status';
import { prisma } from '@studyhub/database';

export const findUserProfileById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,

      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const updateUserProfile = async (
  userId: string,
  data: {
    firstName: string;
    lastName?: string | null;
  },
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerifiedAt: true,
      createdAt: true,
      updatedAt: true,

      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const findActiveSessionsByUserId = async (userId: string) => {
  return prisma.session.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      lastActiveAt: true,
      expiresAt: true,
      createdAt: true,
    },
    orderBy: {
      lastActiveAt: 'desc',
    },
  });
};

export const revokeUserSession = async (userId: string, sessionId: string): Promise<boolean> => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const result = await tx.session.updateMany({
      where: {
        id: sessionId,
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
        revokedAt: now,
      },
    });

    if (result.count !== 1) {
      return false;
    }

    await tx.refreshToken.updateMany({
      where: {
        sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });

    return true;
  });
};

export const revokeOtherUserSessions = async (
  userId: string,
  currentSessionId: string,
): Promise<void> => {
  const now = new Date();

  await prisma.$transaction([
    prisma.session.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
        id: {
          not: currentSessionId,
        },
      },
      data: {
        status: 'REVOKED',
        revokedAt: now,
      },
    }),

    prisma.refreshToken.updateMany({
      where: {
        userId,
        sessionId: {
          not: currentSessionId,
        },
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    }),
  ]);
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      status: true,
    },
  });
};

export const completeEmailChange = async (
  userId: string,
  otpId: string,
  newEmail: string,
): Promise<void> => {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findUnique({
      where: {
        email: newEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError(
        HTTP_STATUS.CONFLICT,
        ERROR_CODES.CONFLICT,
        'Email address is already in use.',
      );
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        email: newEmail,
        emailVerifiedAt: now,
      },
    });

    await tx.otpVerification.update({
      where: {
        id: otpId,
      },
      data: {
        status: 'VERIFIED',
        verifiedAt: now,
      },
    });
  });
};
