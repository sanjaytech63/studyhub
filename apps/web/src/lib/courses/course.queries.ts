import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  fetchCourses,
  fetchCourseBySlug,
  fetchCategories,
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  submitReview,
  type FetchCoursesParams,
} from '@/services/courses/course.service';
import type {
  Course,
  CourseModule,
  Review,
  Category,
  CourseSummary,
  PaginationMeta,
} from '@studyhub/types';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: FetchCoursesParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (slug: string) => [...courseKeys.details(), slug] as const,
  categories: () => ['categories'] as const,
  wishlist: () => ['wishlist'] as const,
};

export function useCourses(
  params?: FetchCoursesParams,
  options?: Omit<
    UseQueryOptions<{ courses: CourseSummary[]; pagination: PaginationMeta }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => fetchCourses(params),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useCourseBySlug(
  slug: string,
  options?: Omit<
    UseQueryOptions<
      Course & {
        modules: CourseModule[];
        reviews: Review[];
        totalDurationMinutes: number;
        totalLessonsCount: number;
      }
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => fetchCourseBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCategories(options?: Omit<UseQueryOptions<Category[]>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: courseKeys.categories(),
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useWishlist() {
  return useQuery({
    queryKey: courseKeys.wishlist(),
    queryFn: fetchWishlist,
    staleTime: 60 * 1000,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, isWishlisted }: { courseId: string; isWishlisted: boolean }) => {
      if (isWishlisted) {
        await removeFromWishlist(courseId);
      } else {
        await addToWishlist(courseId);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.wishlist() });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: courseKeys.details() });
    },
  });
}
