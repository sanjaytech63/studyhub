import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { EnrollmentStatus } from '@studyhub/database';
import * as enrollmentRepo from './enrollment.repository';

export const getMyCourses = async (userId: string) => {
  const enrollments = await enrollmentRepo.findStudentEnrollments(userId);

  return enrollments.map((item) => {
    const course = item.course;
    const progress = course.courseProgresses[0];
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

    return {
      enrollmentId: item.id,
      enrolledAt: item.enrolledAt,
      status: item.status,
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        instructor: course.instructor,
        totalLessons,
      },
      progress: {
        progressPercent: progress ? Number(progress.progressPercent) : 0,
        completedLessonsCount: progress?.completedLessonsCount ?? 0,
        totalLessonsCount: progress?.totalLessonsCount ?? totalLessons,
        lastAccessedLessonId: progress?.lastAccessedLessonId ?? null,
        isCompleted: progress?.completedAt != null,
      },
    };
  });
};

export const getCourseProgress = async (userId: string, courseId: string) => {
  const progress = await enrollmentRepo.findCourseProgress(userId, courseId);
  if (!progress) {
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND,
      'Progress not found or user not enrolled.',
    );
  }

  return {
    ...progress,
    progressPercent: Number(progress.progressPercent),
  };
};

export const listAdminEnrollments = async (filters: {
  search?: string;
  status?: EnrollmentStatus;
  page?: number;
  limit?: number;
}) => {
  return enrollmentRepo.findAdminEnrollments(filters);
};

export const grantEnrollment = async (userId: string, courseId: string) => {
  return enrollmentRepo.createEnrollment(userId, courseId);
};

export const updateEnrollmentStatus = async (id: string, status: EnrollmentStatus) => {
  return enrollmentRepo.updateEnrollmentStatus(id, status);
};
