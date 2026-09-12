import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { courseQuerySchema, createCourseSchema, updateCourseSchema } from '@studyhub/validation';
import * as courseService from './course.service';

export const listCoursesHandler: RequestHandler = async (req, res) => {
  const query = courseQuerySchema.parse(req.query);
  const result = await courseService.listPublishedCourses(query as any);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};

export const getCourseBySlugHandler: RequestHandler = async (req, res) => {
  const course = await courseService.getCourseDetails(req.params.slug as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: course,
  });
};

export const listAdminCoursesHandler: RequestHandler = async (req, res) => {
  const { status, search, page, limit } = req.query;
  const result = await courseService.listAdminCourses({
    status: status as any,
    search: search as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result.courses,
    pagination: {
      page: result.page,
      limit: result.limit,
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
    },
  });
};

export const getAdminCourseByIdHandler: RequestHandler = async (req, res) => {
  const course = await courseService.getAdminCourseById(req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: course,
  });
};

export const createCourseHandler: RequestHandler = async (req, res) => {
  const validated = createCourseSchema.parse(req.body);
  const course = await courseService.createCourse(validated as any);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: course,
  });
};

export const updateCourseHandler: RequestHandler = async (req, res) => {
  const validated = updateCourseSchema.parse(req.body);
  const updated = await courseService.updateCourse(req.params.id as string, validated);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};

export const publishCourseHandler: RequestHandler = async (req, res) => {
  const published = await courseService.publishCourse(req.params.id as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: published,
    message: 'Course published successfully',
  });
};

export const deleteCourseHandler: RequestHandler = async (req, res) => {
  await courseService.deleteCourse(req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
