import { prisma } from '@studyhub/database';
import { AppError } from '@/errors/app-error';
import { HTTP_STATUS } from '@/utils/http-status';
import { ERROR_CODES } from '@/errors/error-codes';
import * as wishlistRepo from './wishlist.repository';

export const getWishlist = async (userId: string) => {
  const items = await wishlistRepo.findUserWishlist(userId);

  return items.map((item) => {
    const course = item.course;
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
        : 4.9;

    return {
      id: item.id,
      courseId: course.id,
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subtitle: course.subtitle,
        level: course.level,
        price: Number(course.price),
        originalPrice: course.originalPrice ? Number(course.originalPrice) : null,
        thumbnailUrl: course.thumbnailUrl,
        category: course.category,
        instructor: course.instructor,
        rating: avgRating,
        reviewCount: course.reviews.length,
        enrollmentCount: course._count.enrollments,
        totalDurationMinutes: totalDuration,
        totalLessonsCount: totalLessons,
      },
      createdAt: item.createdAt,
    };
  });
};

export const addCourseToWishlist = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND, 'Course not found.');
  }
  return wishlistRepo.addToWishlist(userId, courseId);
};

export const removeCourseFromWishlist = async (userId: string, courseId: string) => {
  return wishlistRepo.removeFromWishlist(userId, courseId);
};
