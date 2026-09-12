import { prisma, ReviewStatus, Prisma } from '@studyhub/database';

export const findCourseReviews = async (courseId: string) => {
  return prisma.review.findMany({
    where: {
      courseId,
      status: 'APPROVED',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      },
    },
  });
};

export const findUserReview = async (userId: string, courseId: string) => {
  return prisma.review.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const createReview = async (data: {
  userId: string;
  courseId: string;
  rating: number;
  title?: string;
  comment: string;
}) => {
  return prisma.review.create({
    data: {
      ...data,
      status: 'PENDING', // requires moderation
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });
};

export const findAdminReviews = async (filters: {
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.ReviewWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return { reviews, totalCount, page, limit };
};

export const updateReviewStatus = async (id: string, status: ReviewStatus) => {
  return prisma.review.update({
    where: { id },
    data: { status },
  });
};
