import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { prisma, ReviewStatus } from '@studyhub/database';
import * as reviewRepo from './review.repository';

export const getCourseReviews = async (courseId: string) => {
  return reviewRepo.findCourseReviews(courseId);
};

export const submitReview = async (
  userId: string,
  input: {
    courseId: string;
    rating: number;
    title?: string;
    comment: string;
  },
) => {
  // 1. Verify user is enrolled
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: input.courseId,
      },
    },
  });

  if (!enrollment || enrollment.status !== 'ACTIVE') {
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN,
      'Only enrolled students can review this course.',
    );
  }

  // 2. Check for duplicate review
  const existingReview = await reviewRepo.findUserReview(userId, input.courseId);
  if (existingReview) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      'You have already submitted a review for this course.',
    );
  }

  return reviewRepo.createReview({
    userId,
    courseId: input.courseId,
    rating: input.rating,
    title: input.title,
    comment: input.comment,
  });
};

export const listAdminReviews = async (filters: {
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}) => {
  return reviewRepo.findAdminReviews(filters);
};

export const moderateReview = async (id: string, status: ReviewStatus) => {
  return reviewRepo.updateReviewStatus(id, status);
};
