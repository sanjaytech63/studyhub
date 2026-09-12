import { prisma, EnrollmentStatus, Prisma } from '@studyhub/database';

export const findStudentEnrollments = async (userId: string) => {
  return prisma.enrollment.findMany({
    where: {
      userId,
      status: 'ACTIVE',
    },
    orderBy: { enrolledAt: 'desc' },
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
          courseProgresses: {
            where: { userId },
          },
          modules: {
            include: {
              lessons: {
                select: {
                  id: true,
                  title: true,
                  durationMinutes: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const findCourseProgress = async (userId: string, courseId: string) => {
  return prisma.courseProgress.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  });
};

export const findAdminEnrollments = async (filters: {
  search?: string;
  status?: EnrollmentStatus;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.EnrollmentWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      { user: { firstName: { contains: filters.search, mode: 'insensitive' } } },
      { course: { title: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [enrollments, totalCount] = await Promise.all([
    prisma.enrollment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
          },
        },
      },
    }),
    prisma.enrollment.count({ where }),
  ]);

  return { enrollments, totalCount, page, limit };
};

export const createEnrollment = async (userId: string, courseId: string) => {
  return prisma.$transaction(async (tx) => {
    const enrollment = await tx.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: 'ACTIVE',
      },
      create: {
        userId,
        courseId,
        status: 'ACTIVE',
      },
    });

    const totalLessons = await tx.lesson.count({
      where: { module: { courseId } },
    });

    await tx.courseProgress.upsert({
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
        progressPercent: 0,
        completedLessonsCount: 0,
        totalLessonsCount: totalLessons,
      },
    });

    return enrollment;
  });
};

export const updateEnrollmentStatus = async (id: string, status: EnrollmentStatus) => {
  return prisma.enrollment.update({
    where: { id },
    data: { status },
  });
};
