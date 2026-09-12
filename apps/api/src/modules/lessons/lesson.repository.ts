import { prisma, LessonType, ProgressStatus } from '@studyhub/database';

export const findLessonById = async (id: string) => {
  return prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          course: true,
        },
      },
      resources: true,
    },
  });
};

export const findUserEnrollment = async (userId: string, courseId: string) => {
  return prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const upsertLessonProgress = async (
  userId: string,
  lessonId: string,
  data: {
    status: ProgressStatus;
    watchTimeSeconds: number;
    completedAt?: Date;
  },
) => {
  return prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId,
        lessonId,
      },
    },
    update: {
      status: data.status,
      watchTimeSeconds: data.watchTimeSeconds,
      completedAt: data.completedAt,
    },
    create: {
      userId,
      lessonId,
      status: data.status,
      watchTimeSeconds: data.watchTimeSeconds,
      completedAt: data.completedAt,
    },
  });
};

export const getCourseLessonsCount = async (courseId: string) => {
  return prisma.lesson.count({
    where: {
      module: {
        courseId,
      },
    },
  });
};

export const getCompletedLessonsCount = async (userId: string, courseId: string) => {
  return prisma.lessonProgress.count({
    where: {
      userId,
      status: 'COMPLETED',
      lesson: {
        module: {
          courseId,
        },
      },
    },
  });
};

export const upsertCourseProgress = async (
  userId: string,
  courseId: string,
  data: {
    progressPercent: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    lastAccessedLessonId?: string;
    completedAt?: Date;
  },
) => {
  return prisma.courseProgress.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      progressPercent: data.progressPercent,
      completedLessonsCount: data.completedLessonsCount,
      totalLessonsCount: data.totalLessonsCount,
      lastAccessedLessonId: data.lastAccessedLessonId,
      completedAt: data.completedAt,
    },
    create: {
      userId,
      courseId,
      progressPercent: data.progressPercent,
      completedLessonsCount: data.completedLessonsCount,
      totalLessonsCount: data.totalLessonsCount,
      lastAccessedLessonId: data.lastAccessedLessonId,
      completedAt: data.completedAt,
    },
  });
};

export const findCertificate = async (userId: string, courseId: string) => {
  return prisma.certificate.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
};

export const createCertificate = async (data: {
  certificateCode: string;
  userId: string;
  courseId: string;
  verificationUrl: string;
  pdfUrl?: string;
}) => {
  return prisma.certificate.create({
    data,
  });
};

/* Module Operations */
export const createModule = async (data: {
  courseId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}) => {
  return prisma.module.create({
    data,
  });
};

export const updateModule = async (
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    orderIndex?: number;
  }>,
) => {
  return prisma.module.update({
    where: { id },
    data,
  });
};

export const deleteModule = async (id: string) => {
  return prisma.module.delete({
    where: { id },
  });
};

/* Lesson Operations */
export const createLesson = async (data: {
  moduleId: string;
  title: string;
  slug: string;
  type?: LessonType;
  durationMinutes?: number;
  videoUrl?: string;
  contentMarkdown?: string;
  isFreePreview?: boolean;
  dripDelayDays?: number;
  orderIndex?: number;
}) => {
  return prisma.lesson.create({
    data,
  });
};

export const updateLesson = async (
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    type?: LessonType;
    durationMinutes?: number;
    videoUrl?: string;
    contentMarkdown?: string;
    isFreePreview?: boolean;
    dripDelayDays?: number;
    orderIndex?: number;
  }>,
) => {
  return prisma.lesson.update({
    where: { id },
    data,
  });
};

export const deleteLesson = async (id: string) => {
  return prisma.lesson.delete({
    where: { id },
  });
};
