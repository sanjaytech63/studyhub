import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import { prisma, CourseStatus } from '@studyhub/database';
import * as courseRepo from './course.repository';

export const listPublishedCourses = async (filters: courseRepo.CourseQueryFilters) => {
  const { courses, totalCount, page, limit } = await courseRepo.findPublishedCourses(filters);

  const formattedCourses = courses.map((course) => {
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalDuration = course.modules.reduce(
      (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
      0,
    );
    const avgRating =
      course.reviews.length > 0
        ? Number(
            (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(
              1,
            ),
          )
        : 4.8; // default baseline

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      description: course.description,
      level: course.level,
      language: course.language,
      price: Number(course.price),
      originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
      thumbnailUrl: course.thumbnailUrl,
      isFeatured: course.isFeatured,
      isBestseller: course.isBestseller,
      category: course.category,
      instructor: course.instructor,
      rating: avgRating,
      reviewCount: course.reviews.length,
      enrollmentCount: course._count.enrollments,
      totalDurationMinutes: totalDuration,
      totalLessonsCount: totalLessons,
    };
  });

  return {
    items: formattedCourses,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      hasNextPage: page * limit < totalCount,
      hasPrevPage: page > 1,
    },
  };
};

export const getCourseDetails = async (slug: string) => {
  const course = await courseRepo.findCourseBySlug(slug);
  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = course.modules.reduce(
    (acc, m) => acc + m.lessons.reduce((lAcc, l) => lAcc + l.durationMinutes, 0),
    0,
  );
  const avgRating =
    course.reviews.length > 0
      ? Number(
          (course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length).toFixed(1),
        )
      : 4.9;

  return {
    ...course,
    price: Number(course.price),
    originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
    rating: avgRating,
    reviewCount: course._count.reviews,
    enrollmentCount: course._count.enrollments,
    totalDurationMinutes: totalDuration,
    totalLessonsCount: totalLessons,
  };
};

export const listAdminCourses = async (filters: {
  status?: CourseStatus;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  return courseRepo.findAdminCourses(filters);
};

export const getAdminCourseById = async (id: string) => {
  const course = await courseRepo.findCourseById(id);
  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }
  return {
    ...course,
    price: Number(course.price),
    originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
  };
};

export const createCourse = async (input: {
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  outcomeDescription?: string;
  level?: any;
  language?: string;
  price?: number;
  originalPrice?: number;
  thumbnailUrl?: string;
  trailerVideoUrl?: string;
  categoryId?: string;
  instructorId: string;
  prerequisites?: string[];
  learningOutcomes?: string[];
  targetAudience?: string[];
}) => {
  const existing = await courseRepo.findCourseBySlug(input.slug);
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT, 'Course slug already exists.');
  }

  // Ensure instructor profile exists, create if missing for this user
  let instructor = await prisma.instructorProfile.findUnique({
    where: { id: input.instructorId },
  });

  if (!instructor) {
    instructor = await prisma.instructorProfile.findFirst({
      where: { userId: input.instructorId },
    });
    if (!instructor) {
      instructor = await prisma.instructorProfile.create({
        data: {
          userId: input.instructorId,
          headline: 'Lead Instructor',
        },
      });
    }
  }

  return courseRepo.createCourse({
    title: input.title,
    slug: input.slug,
    subtitle: input.subtitle,
    description: input.description,
    outcomeDescription: input.outcomeDescription,
    level: input.level || 'ALL_LEVELS',
    language: input.language || 'English',
    price: input.price ?? 0,
    originalPrice: input.originalPrice,
    thumbnailUrl: input.thumbnailUrl,
    trailerVideoUrl: input.trailerVideoUrl,
    prerequisites: input.prerequisites ?? [],
    learningOutcomes: input.learningOutcomes ?? [],
    targetAudience: input.targetAudience ?? [],
    status: 'DRAFT',
    category: input.categoryId ? { connect: { id: input.categoryId } } : undefined,
    instructor: { connect: { id: instructor.id } },
  });
};

export const updateCourse = async (id: string, input: any) => {
  const existing = await courseRepo.findCourseById(id);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }

  const { categoryId, instructorId, ...data } = input;
  return courseRepo.updateCourse(id, {
    ...data,
    category: categoryId ? { connect: { id: categoryId } } : undefined,
  });
};

export const publishCourse = async (id: string) => {
  const course = await courseRepo.findCourseById(id);
  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }

  if (course.modules.length === 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      'Cannot publish course without any modules.',
    );
  }

  return courseRepo.updateCourse(id, {
    status: 'PUBLISHED',
  });
};

export const deleteCourse = async (id: string) => {
  const existing = await courseRepo.findCourseById(id);
  if (!existing) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }
  return courseRepo.deleteCourse(id);
};
