import crypto from 'node:crypto';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import * as lessonRepo from './lesson.repository';

export const getLessonContent = async (lessonId: string, userId?: string) => {
  const lesson = await lessonRepo.findLessonById(lessonId);
  if (!lesson) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Lesson not found.');
  }

  const courseId = lesson.module.courseId;

  // If free preview, public can view
  if (lesson.isFreePreview) {
    return {
      ...lesson,
      hasFullAccess: true,
      isPreview: true,
    };
  }

  // Not free preview: user must be authenticated
  if (!userId) {
    throw new AppError(
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED,
      'Please sign in to access this lesson.',
    );
  }

  // Verify enrollment
  const enrollment = await lessonRepo.findUserEnrollment(userId, courseId);
  if (!enrollment || enrollment.status !== 'ACTIVE') {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      'You must be enrolled in this course to view this lesson.',
    );
  }

  return {
    ...lesson,
    hasFullAccess: true,
    isPreview: false,
  };
};

export const updateProgress = async (
  lessonId: string,
  userId: string,
  watchTimeSeconds: number,
  isCompleted: boolean,
) => {
  const lesson = await lessonRepo.findLessonById(lessonId);
  if (!lesson) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Lesson not found.');
  }

  const courseId = lesson.module.courseId;

  // Verify enrollment
  const enrollment = await lessonRepo.findUserEnrollment(userId, courseId);
  if (!enrollment || enrollment.status !== 'ACTIVE') {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      'You are not enrolled in this course.',
    );
  }

  // 1. Update lesson progress
  const progressRecord = await lessonRepo.upsertLessonProgress(userId, lessonId, {
    status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
    watchTimeSeconds,
    completedAt: isCompleted ? new Date() : undefined,
  });

  // 2. Recalculate Course Progress
  const [totalLessons, completedLessons] = await Promise.all([
    lessonRepo.getCourseLessonsCount(courseId),
    lessonRepo.getCompletedLessonsCount(userId, courseId),
  ]);

  const progressPercent =
    totalLessons > 0 ? Number(((completedLessons / totalLessons) * 100).toFixed(1)) : 0;

  const isCourseCompleted = progressPercent >= 100;

  const courseProgress = await lessonRepo.upsertCourseProgress(userId, courseId, {
    progressPercent,
    completedLessonsCount: completedLessons,
    totalLessonsCount: totalLessons,
    lastAccessedLessonId: lessonId,
    completedAt: isCourseCompleted ? new Date() : undefined,
  });

  // 3. Certificate Generation if 100% completed
  let certificate = null;
  if (isCourseCompleted) {
    const existingCert = await lessonRepo.findCertificate(userId, courseId);
    if (!existingCert) {
      const code = `SH-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      certificate = await lessonRepo.createCertificate({
        certificateCode: code,
        userId,
        courseId,
        verificationUrl: `https://studyhubonline.store/certificates/${code}`,
      });
    } else {
      certificate = existingCert;
    }
  }

  return {
    lessonProgress: progressRecord,
    courseProgress,
    certificate,
  };
};

/* Module Operations */
export const createModule = async (data: {
  courseId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}) => {
  return lessonRepo.createModule(data);
};

export const updateModule = async (
  id: string,
  data: Partial<{
    title: string;
    description?: string;
    orderIndex?: number;
  }>,
) => {
  return lessonRepo.updateModule(id, data);
};

export const deleteModule = async (id: string) => {
  return lessonRepo.deleteModule(id);
};

/* Lesson Operations */
export const createLesson = async (data: any) => {
  return lessonRepo.createLesson(data);
};

export const updateLesson = async (id: string, data: any) => {
  return lessonRepo.updateLesson(id, data);
};

export const deleteLesson = async (id: string) => {
  return lessonRepo.deleteLesson(id);
};
