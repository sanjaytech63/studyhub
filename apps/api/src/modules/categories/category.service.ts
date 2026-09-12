import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import * as categoryRepo from './category.repository';

export const listCategories = async () => {
  const categories = await categoryRepo.findCategories();
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    orderIndex: cat.orderIndex,
    courseCount: cat._count.courses,
  }));
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await categoryRepo.findCategoryBySlug(slug);
  if (!category) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Category not found.');
  }
  return category;
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
}) => {
  const existing = await categoryRepo.findCategoryBySlug(data.slug);
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, 'Category slug already exists.');
  }
  return categoryRepo.createCategory(data);
};

export const updateCategory = async (
  id: string,
  data: Partial<{
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    orderIndex?: number;
  }>,
) => {
  const existing = await categoryRepo.findCategoryById(id);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Category not found.');
  }
  return categoryRepo.updateCategory(id, data);
};

export const deleteCategory = async (id: string) => {
  const existing = await categoryRepo.findCategoryById(id);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Category not found.');
  }
  return categoryRepo.deleteCategory(id);
};
