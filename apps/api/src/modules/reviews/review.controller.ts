import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { createReviewSchema, moderateReviewSchema } from '@studyhub/validation';
import * as reviewService from './review.service';

export const getCourseReviewsHandler: RequestHandler = async (req, res) => {
  const reviews = await reviewService.getCourseReviews(req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: reviews,
  });
};

export const submitReviewHandler: RequestHandler = async (req, res) => {
  const validated = createReviewSchema.parse(req.body);
  const review = await reviewService.submitReview(req.user!.id, validated);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: review,
    message: 'Thank you! Your review has been submitted for moderation.',
  });
};

export const listAdminReviewsHandler: RequestHandler = async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await reviewService.listAdminReviews({
    status: status as any,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.reviews,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
};

export const moderateReviewHandler: RequestHandler = async (req, res) => {
  const { status } = moderateReviewSchema.parse(req.body);
  const updated = await reviewService.moderateReview(req.params.id as string, status);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};
