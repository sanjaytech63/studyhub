import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { z } from 'zod';
import * as enrollmentService from './enrollment.service';

export const getMyCoursesHandler: RequestHandler = async (req, res) => {
  const courses = await enrollmentService.getMyCourses(req.user!.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: courses,
  });
};

export const getCourseProgressHandler: RequestHandler = async (req, res) => {
  const progress = await enrollmentService.getCourseProgress(req.user!.id, req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: progress,
  });
};

export const listAdminEnrollmentsHandler: RequestHandler = async (req, res) => {
  const { search, status, page, limit } = req.query;
  const result = await enrollmentService.listAdminEnrollments({
    search: search as string,
    status: status as any,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.enrollments,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
};

const grantSchema = z.object({
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export const grantEnrollmentHandler: RequestHandler = async (req, res) => {
  const { userId, courseId } = grantSchema.parse(req.body);
  const enrollment = await enrollmentService.grantEnrollment(userId, courseId);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: enrollment,
    message: 'Enrollment granted successfully',
  });
};

const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'COMPLETED', 'REVOKED']),
});

export const updateEnrollmentStatusHandler: RequestHandler = async (req, res) => {
  const { status } = statusSchema.parse(req.body);
  const updated = await enrollmentService.updateEnrollmentStatus(req.params.id as string, status);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};
