import { prisma } from '@studyhub/database';

export const findUserWishlist = async (userId: string) => {
  return prisma.wishlist.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      course: {
        include: {
          category: true,
          instructor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          modules: {
            include: {
              lessons: {
                select: {
                  id: true,
                  durationMinutes: true,
                },
              },
            },
          },
          reviews: {
            where: { status: 'APPROVED' },
            select: { rating: true },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      },
    },
  });
};

export const addToWishlist = async (userId: string, courseId: string) => {
  return prisma.wishlist.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {},
    create: {
      userId,
      courseId,
    },
  });
};

export const removeFromWishlist = async (userId: string, courseId: string) => {
  return prisma.wishlist.deleteMany({
    where: {
      userId,
      courseId,
    },
  });
};
