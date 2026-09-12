import type { RequestHandler } from 'express';
import { HTTP_STATUS } from '@/utils/http-status';
import { createCategorySchema, updateCategorySchema } from '@studyhub/validation';
import * as categoryService from './category.service';

export const listCategoriesHandler: RequestHandler = async (_req, res) => {
  const categories = await categoryService.listCategories();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: categories,
  });
};

export const getCategoryHandler: RequestHandler = async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug as string);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: category,
  });
};

export const createCategoryHandler: RequestHandler = async (req, res) => {
  const validated = createCategorySchema.parse(req.body);
  const created = await categoryService.createCategory(validated);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: created,
  });
};

export const updateCategoryHandler: RequestHandler = async (req, res) => {
  const validated = updateCategorySchema.parse(req.body);
  const updated = await categoryService.updateCategory(req.params.id as string, validated);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: updated,
  });
};

export const deleteCategoryHandler: RequestHandler = async (req, res) => {
  await categoryService.deleteCategory(req.params.id as string);
  res.status(HTTP_STATUS.NO_CONTENT).send();
};
