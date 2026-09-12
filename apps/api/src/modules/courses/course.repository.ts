import { prisma, Prisma, CourseStatus } from '@studyhub/database';

export interface CourseQueryFilters {
  search?: string;
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
  status?: CourseStatus;
}

export const findPublishedCourses = async (filters: CourseQueryFilters) => {
  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput = {
    status: 'PUBLISHED',
  };

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { subtitle: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.category && filters.category !== 'all') {
    where.category = {
      slug: filters.category,
    };
  }

  if (filters.level) {
    where.level = filters.level as any;
  }

  if (filters.isFree) {
    where.price = 0;
  } else {
    if (filters.minPrice !== undefined) {
      where.price = { ...(where.price as object), gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined) {
      where.price = { ...(where.price as object), lte: filters.maxPrice };
    }
  }

  if (filters.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  if (filters.isBestseller !== undefined) {
    where.isBestseller = filters.isBestseller;
  }

  let orderBy: Prisma.CourseOrderByWithRelationInput = { createdAt: 'desc' };
  if (filters.sort === 'price-low') {
    orderBy = { price: 'asc' };
  } else if (filters.sort === 'price-high') {
    orderBy = { price: 'desc' };
  }

  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        instructor: {
          select: {
            id: true,
            headline: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
        modules: {
          select: {
            id: true,
            lessons: {
              select: {
                id: true,
                durationMinutes: true,
              },
            },
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          select: {
            rating: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, totalCount, page, limit };
};

export const findCourseBySlug = async (slug: string) => {
  return prisma.course.findUnique({
    where: { slug },
    include: {
      category: true,
      instructor: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
      technologies: {
        orderBy: { orderIndex: 'asc' },
        include: {
          technology: true,
        },
      },
      modules: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              moduleId: true,
              title: true,
              slug: true,
              type: true,
              durationMinutes: true,
              isFreePreview: true,
              orderIndex: true,
              dripDelayDays: true,
            },
          },
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
          reviews: { where: { status: 'APPROVED' } },
        },
      },
    },
  });
};

export const findCourseById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id },
    include: {
      category: true,
      instructor: {
        include: {
          user: true,
        },
      },
      technologies: {
        include: {
          technology: true,
        },
      },
      modules: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
          },
        },
      },
    },
  });
};

export const findAdminCourses = async (filters: {
  status?: CourseStatus;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: Prisma.CourseWhereInput = {};
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { slug: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            orders: { where: { status: 'PAID' } },
          },
        },
      },
    }),
    prisma.course.count({ where }),
  ]);

  return { courses, totalCount, page, limit };
};

export const createCourse = async (data: Prisma.CourseCreateInput) => {
  return prisma.course.create({
    data,
  });
};

export const updateCourse = async (id: string, data: Prisma.CourseUpdateInput) => {
  return prisma.course.update({
    where: { id },
    data,
  });
};

export const deleteCourse = async (id: string) => {
  return prisma.course.delete({
    where: { id },
  });
};
