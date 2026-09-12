import { prisma } from '@studyhub/database';

export const findCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      orderIndex: 'asc',
    },
    include: {
      _count: {
        select: {
          courses: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
  });
};

export const findCategoryBySlug = async (slug: string) => {
  return prisma.category.findUnique({
    where: { slug },
  });
};

export const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
}) => {
  return prisma.category.create({
    data,
  });
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
  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  return prisma.category.delete({
    where: { id },
  });
};
