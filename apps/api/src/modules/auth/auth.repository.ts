import { prisma, type Prisma, OtpPurpose } from '@studyhub/database';

/**
 * ============================================================================
 * USER
 * ============================================================================
 */

/**
 * Find a user by normalized email.
 *
 * Email normalization belongs to the service layer.
 */
export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

/**
 * Find a user by ID.
 */
export const findUserById = async (userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

/**
 * Create a user.
 */
export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};

/**
 * Mark user's email as verified.
 *
 * Kept as a standalone repository operation for future use cases.
 */
export const markUserEmailVerified = async (userId: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerifiedAt: new Date(),
    },
  });
};

/**
 * ============================================================================
 * ROLE
 * ============================================================================
 */

export const findRoleByName = async (name: string) => {
  return prisma.role.findUnique({
    where: {
      name,
    },
  });
};

/**
 * ============================================================================
 * SESSION
 * ============================================================================
 */

export const createSession = async (data: Prisma.SessionCreateInput) => {
  return prisma.session.create({
    data,
  });
};

export const createSessionWithRefreshToken = async ({
  session,
  refreshToken,
}: {
  session: Prisma.SessionCreateInput;
  refreshToken: Prisma.RefreshTokenCreateInput;
}) => {
  return prisma.$transaction(async (tx) => {
    const createdSession = await tx.session.create({
      data: session,
    });

    const createdRefreshToken = await tx.refreshToken.create({
      data: {
        ...refreshToken,
        session: {
          connect: {
            id: createdSession.id,
          },
        },
        user: {
          connect: {
            id: createdSession.userId,
          },
        },
      },
    });

    return {
      session: createdSession,
      refreshToken: createdRefreshToken,
    };
  });
};

export const findSessionById = async (sessionId: string) => {
  return prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });
};

export const revokeSession = async (sessionId: string) => {
  return prisma.session.update({
    where: {
      id: sessionId,
    },
    data: {
      status: 'REVOKED',
      revokedAt: new Date(),
    },
  });
};

export const revokeSessionWithRefreshTokens = async (sessionId: string) => {
  return prisma.$transaction(async (tx) => {
    const session = await tx.session.updateMany({
      where: {
        id: sessionId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });

    if (session.count !== 1) {
      return false;
    }

    await tx.refreshToken.updateMany({
      where: {
        sessionId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return true;
  });
};

/**
 * ============================================================================
 * REFRESH TOKEN
 * ============================================================================
 */

export const createRefreshToken = async (data: Prisma.RefreshTokenCreateInput) => {
  return prisma.refreshToken.create({
    data,
  });
};

export const findRefreshTokenByHash = async (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
  });
};

export const findRefreshTokenWithSession = async (tokenHash: string) => {
  return prisma.refreshToken.findUnique({
    where: {
      tokenHash,
    },
    include: {
      session: true,
      user: true,
    },
  });
};

export const revokeRefreshToken = async (tokenId: string, replacedByTokenId?: string) => {
  return prisma.refreshToken.update({
    where: {
      id: tokenId,
    },
    data: {
      revokedAt: new Date(),

      ...(replacedByTokenId
        ? {
            replacedByTokenId,
          }
        : {}),
    },
  });
};

export const rotateRefreshToken = async ({
  oldTokenId,
  newToken,
}: {
  oldTokenId: string;
  newToken: Prisma.RefreshTokenCreateInput;
}) => {
  return prisma.$transaction(async (tx) => {
    const revokedToken = await tx.refreshToken.updateMany({
      where: {
        id: oldTokenId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    if (revokedToken.count !== 1) {
      return null;
    }

    const createdToken = await tx.refreshToken.create({
      data: newToken,
    });

    await tx.refreshToken.update({
      where: {
        id: oldTokenId,
      },
      data: {
        replacedByTokenId: createdToken.id,
      },
    });

    return createdToken;
  });
};

/**
 * Find the newest pending OTP for a user and purpose.
 */
export const findLatestPendingOtp = async (userId: string, purpose: OtpPurpose) => {
  return prisma.otpVerification.findFirst({
    where: {
      userId,
      purpose,
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Increment failed OTP attempts.
 *
 * The conditional WHERE prevents modifying an OTP that is no longer pending.
 */
export const incrementOtpAttempts = async (otpId: string) => {
  const result = await prisma.otpVerification.updateMany({
    where: {
      id: otpId,
      status: 'PENDING',
    },
    data: {
      attempts: {
        increment: 1,
      },
    },
  });

  if (result.count !== 1) {
    return null;
  }

  return prisma.otpVerification.findUnique({
    where: {
      id: otpId,
    },
  });
};

/**
 * Block an OTP.
 */
export const blockOtp = async (otpId: string) => {
  return prisma.otpVerification.updateMany({
    where: {
      id: otpId,
      status: 'PENDING',
    },
    data: {
      status: 'BLOCKED',
    },
  });
};

/**
 * Mark an OTP as expired.
 */
export const markOtpExpired = async (otpId: string) => {
  return prisma.otpVerification.updateMany({
    where: {
      id: otpId,
      status: 'PENDING',
    },
    data: {
      status: 'EXPIRED',
    },
  });
};

/**
 * ============================================================================
 * REGISTRATION TRANSACTION
 * ============================================================================
 *
 * Creates:
 *
 *   User
 *     +
 *   Email Verification OTP
 *
 * atomically.
 *
 * Expensive password hashing happens before entering the transaction.
 */
type CreateUserWithOtpInput = {
  user: Prisma.UserCreateInput;

  otp: {
    purpose: 'EMAIL_VERIFICATION';
    status: 'PENDING';
    codeHash: string;
    expiresAt: Date;
  };
};

export const createUserWithOtp = async ({ user, otp }: CreateUserWithOtpInput) => {
  return prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: user,
    });

    const createdOtp = await tx.otpVerification.create({
      data: {
        purpose: otp.purpose,
        status: otp.status,
        codeHash: otp.codeHash,
        expiresAt: otp.expiresAt,

        user: {
          connect: {
            id: createdUser.id,
          },
        },
      },
    });

    return {
      user: createdUser,
      otp: createdOtp,
    };
  });
};

/**
 * ============================================================================
 * EMAIL VERIFICATION TRANSACTION
 * ============================================================================
 *
 * Atomically:
 *
 *   PENDING OTP
 *       ↓
 *   VERIFIED
 *
 * and:
 *
 *   User.emailVerifiedAt
 *       ↓
 *   current timestamp
 *
 * Critical security properties:
 *
 * 1. OTP must still be PENDING.
 * 2. OTP must not be expired.
 * 3. OTP must belong to the specified user.
 * 4. OTP must be for EMAIL_VERIFICATION.
 * 5. Only one concurrent request can consume it.
 */
export const consumeEmailOtpAtomically = async ({
  otpId,
  userId,
  now = new Date(),
}: {
  otpId: string;
  userId: string;
  now?: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    const otpResult = await tx.otpVerification.updateMany({
      where: {
        id: otpId,
        userId,
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
        expiresAt: {
          gt: now,
        },
      },
      data: {
        status: 'VERIFIED',
        verifiedAt: now,
      },
    });

    /**
     * Zero rows means:
     *
     * - OTP was already consumed
     * - OTP expired
     * - OTP was blocked
     * - OTP belongs to another user
     * - OTP does not exist
     */
    if (otpResult.count !== 1) {
      return null;
    }

    const user = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerifiedAt: now,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerifiedAt: true,
      },
    });

    return user;
  });
};

export const expirePendingEmailVerificationOtps = async (userId: string) => {
  return prisma.otpVerification.updateMany({
    where: {
      userId,
      purpose: 'EMAIL_VERIFICATION',
      status: 'PENDING',
    },
    data: {
      status: 'EXPIRED',
    },
  });
};

export const createEmailVerificationOtp = async ({
  userId,
  codeHash,
  expiresAt,
}: {
  userId: string;
  codeHash: string;
  expiresAt: Date;
}) => {
  return prisma.otpVerification.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      purpose: 'EMAIL_VERIFICATION',
      status: 'PENDING',
      codeHash,
      expiresAt,
    },
  });
};

export const consumeEmailVerificationOtp = async ({
  otpId,
  userId,
}: {
  otpId: string;
  userId: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const otp = await tx.otpVerification.findFirst({
      where: {
        id: otpId,
        userId,
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
      },
    });

    if (!otp) {
      return {
        status: 'INVALID' as const,
      };
    }

    if (otp.expiresAt <= now) {
      await tx.otpVerification.update({
        where: {
          id: otp.id,
        },
        data: {
          status: 'EXPIRED',
        },
      });

      return {
        status: 'EXPIRED' as const,
      };
    }

    if (otp.attempts >= otp.maxAttempts) {
      await tx.otpVerification.update({
        where: {
          id: otp.id,
        },
        data: {
          status: 'BLOCKED',
        },
      });

      return {
        status: 'BLOCKED' as const,
      };
    }

    return {
      status: 'VALID' as const,
      otp,
    };
  });
};

export const markEmailVerificationOtpVerified = async ({
  otpId,
  userId,
}: {
  otpId: string;
  userId: string;
}) => {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    const otpResult = await tx.otpVerification.updateMany({
      where: {
        id: otpId,
        userId,
        purpose: 'EMAIL_VERIFICATION',
        status: 'PENDING',
        expiresAt: {
          gt: now,
        },
      },
      data: {
        status: 'VERIFIED',
        verifiedAt: now,
      },
    });

    if (otpResult.count !== 1) {
      return false;
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerifiedAt: now,
      },
    });

    return true;
  });
};

export const consumePasswordResetOtpAtomically = async ({
  otpId,
  userId,
  passwordHash,
  now = new Date(),
}: {
  otpId: string;
  userId: string;
  passwordHash: string;
  now?: Date;
}): Promise<boolean> => {
  return prisma.$transaction(async (tx) => {
    const otpResult = await tx.otpVerification.updateMany({
      where: {
        id: otpId,
        userId,
        purpose: 'PASSWORD_RESET',
        status: 'PENDING',
        expiresAt: {
          gt: now,
        },
      },
      data: {
        status: 'VERIFIED',
        verifiedAt: now,
      },
    });

    /**
     * Zero rows means the OTP was already consumed,
     * expired, blocked, or does not belong to this user.
     */
    if (otpResult.count !== 1) {
      return false;
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    /**
     * Invalidate all existing sessions and refresh tokens.
     * Password reset is a security boundary.
     */
    await tx.session.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
        revokedAt: now,
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });

    return true;
  });
};

export const expirePendingPasswordResetOtps = async (userId: string): Promise<void> => {
  await prisma.otpVerification.updateMany({
    where: {
      userId,
      purpose: 'PASSWORD_RESET',
      status: 'PENDING',
    },
    data: {
      status: 'EXPIRED',
    },
  });
};

export const createOtpVerification = async ({
  userId,
  purpose,
  codeHash,
  targetEmail,
  expiresAt,
}: {
  userId: string;
  purpose: OtpPurpose;
  codeHash: string;
  targetEmail?: string;
  expiresAt: Date;
}) => {
  return prisma.otpVerification.create({
    data: {
      userId,
      purpose,
      codeHash,
      targetEmail,
      expiresAt,
    },
  });
};

export const resetPasswordAtomically = async ({
  otpId,
  userId,
  passwordHash,
}: {
  otpId: string;
  userId: string;
  passwordHash: string;
}): Promise<boolean> => {
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const otpResult = await tx.otpVerification.updateMany({
      where: {
        id: otpId,
        userId,
        purpose: 'PASSWORD_RESET',
        status: 'PENDING',
        expiresAt: {
          gt: now,
        },
      },
      data: {
        status: 'VERIFIED',
        verifiedAt: now,
      },
    });

    if (otpResult.count !== 1) {
      return false;
    }

    await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        passwordHash,
      },
    });

    await tx.session.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
        revokedAt: now,
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });

    return true;
  });
};

export const updateUserPassword = async (userId: string, passwordHash: string): Promise<void> => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
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

export const expirePendingEmailChangeOtps = async (userId: string): Promise<void> => {
  await prisma.otpVerification.updateMany({
    where: {
      userId,
      purpose: 'EMAIL_CHANGE',
      status: 'PENDING',
    },
    data: {
      status: 'EXPIRED',
    },
  });
};

export const findLatestPendingEmailChangeOtp = async (userId: string) => {
  return prisma.otpVerification.findFirst({
    where: {
      userId,
      purpose: 'EMAIL_CHANGE',
      status: 'PENDING',
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const blockOtpVerification = async (otpId: string): Promise<void> => {
  await prisma.otpVerification.update({
    where: {
      id: otpId,
    },
    data: {
      status: 'BLOCKED',
    },
  });
};
