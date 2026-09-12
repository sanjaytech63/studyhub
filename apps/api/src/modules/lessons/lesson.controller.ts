import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import {
  createModuleSchema,
  updateModuleSchema,
  createLessonSchema,
  updateLessonSchema,
  updateProgressSchema,
} from '@studyhub/validation';
import * as lessonService from './lesson.service';

export const getLessonContentHandler: RequestHandler = async (req, res) => {
  const content = await lessonService.getLessonContent(req.params.id as string, req.user?.id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: content,
  });
};

export const updateProgressHandler: RequestHandler = async (req, res) => {
  const { watchTimeSeconds, isCompleted } = updateProgressSchema.parse(req.body);
  const result = await lessonService.updateProgress(
    req.params.id as string,
    req.user!.id,
    watchTimeSeconds,
    isCompleted,
  );
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: result,
  });
};

/* Admin Module Handlers */
export const createModuleHandler: RequestHandler = async (req, res) => {
  const validated = createModuleSchema.parse(req.body);
  const module = await lessonService.createModule(validated);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: module,
  });
};

export const updateModuleHandler: RequestHandler = async (req, res) => {
  const validated = updateModuleSchema.parse(req.body);
  const updated = await lessonService.updateModule(req.params.id as string, validated);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};

export const deleteModuleHandler: RequestHandler = async (req, res) => {
  await lessonService.deleteModule(req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};

/* Admin Lesson Handlers */
export const createLessonHandler: RequestHandler = async (req, res) => {
  const validated = createLessonSchema.parse(req.body);
  const lesson = await lessonService.createLesson(validated);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: lesson,
  });
};

export const updateLessonHandler: RequestHandler = async (req, res) => {
  const validated = updateLessonSchema.parse(req.body);
  const updated = await lessonService.updateLesson(req.params.id as string, validated);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};

export const deleteLessonHandler: RequestHandler = async (req, res) => {
  await lessonService.deleteLesson(req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
