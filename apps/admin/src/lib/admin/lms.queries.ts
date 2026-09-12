import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  fetchAdminCourses,
  fetchAdminCourseById,
  createAdminCourse,
  updateAdminCourse,
  publishAdminCourse,
  deleteAdminCourse,
  fetchAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  createAdminModule,
  updateAdminModule,
  deleteAdminModule,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
  fetchAdminEnrollments,
  grantAdminEnrollment,
  fetchAdminOrders,
  fetchAdminCoupons,
  createAdminCoupon,
  fetchAdminReviews,
  moderateAdminReview,
  fetchAdminAnalytics,
  fetchAdminPayments,
  type AdminCourse,
  type AdminCategory,
  type AdminModule,
  type AdminLesson,
  type AdminEnrollment,
  type AdminOrder,
  type AdminCoupon,
  type AdminReview,
  type AdminAnalyticsKPIs,
  type AdminPayment,
  type AdminPaymentsResponse,
  type UploadMediaResponse,
} from '@/services/admin-lms.service';

export type {
  AdminCourse,
  AdminCategory,
  AdminModule,
  AdminLesson,
  AdminEnrollment,
  AdminOrder,
  AdminCoupon,
  AdminReview,
  AdminAnalyticsKPIs,
  AdminPayment,
  AdminPaymentsResponse,
  UploadMediaResponse,
};

/* ==========================================================================
   QUERY KEYS FACTORY
========================================================================== */

export const adminLmsKeys = {
  all: ['admin-lms'] as const,
  courses: () => [...adminLmsKeys.all, 'courses'] as const,
  courseList: (params?: { status?: string; search?: string; page?: number; limit?: number }) =>
    [...adminLmsKeys.courses(), 'list', params] as const,
  courseDetail: (id: string) => [...adminLmsKeys.courses(), 'detail', id] as const,
  categories: () => [...adminLmsKeys.all, 'categories'] as const,
  enrollments: () => [...adminLmsKeys.all, 'enrollments'] as const,
  orders: () => [...adminLmsKeys.all, 'orders'] as const,
  payments: () => [...adminLmsKeys.all, 'payments'] as const,
  paymentsList: (params?: { page?: number; limit?: number; provider?: string; status?: string }) =>
    [...adminLmsKeys.payments(), 'list', params] as const,
  coupons: () => [...adminLmsKeys.all, 'coupons'] as const,
  reviews: () => [...adminLmsKeys.all, 'reviews'] as const,
  analytics: () => [...adminLmsKeys.all, 'analytics'] as const,
};

/* ==========================================================================
   COURSES HOOKS
========================================================================== */

export function useAdminCourses(
  params?: { status?: string; search?: string; page?: number; limit?: number },
  options?: Omit<UseQueryOptions<AdminCourse[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminLmsKeys.courseList(params),
    queryFn: () => fetchAdminCourses(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    ...options,
  });
}

export function useAdminCourse(
  id: string,
  options?: Omit<UseQueryOptions<AdminCourse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminLmsKeys.courseDetail(id),
    queryFn: () => fetchAdminCourseById(id),
    enabled: Boolean(id),
    staleTime: 10 * 1000,
    ...options,
  });
}

export function useCreateAdminCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCourse,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.analytics() });
    },
  });
}

export function useUpdateAdminCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminCourse> }) =>
      updateAdminCourse(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function usePublishAdminCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => publishAdminCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.analytics() });
    },
  });
}

export function useDeleteAdminCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => deleteAdminCourse(courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.analytics() });
    },
  });
}

/* ==========================================================================
   CATEGORIES HOOKS
========================================================================== */

export function useAdminCategories(
  options?: Omit<UseQueryOptions<AdminCategory[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminLmsKeys.categories(),
    queryFn: fetchAdminCategories,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useCreateAdminCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.categories() });
    },
  });
}

export function useUpdateAdminCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; slug?: string; description?: string };
    }) => updateAdminCategory(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.categories() });
    },
  });
}

export function useDeleteAdminCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.categories() });
    },
  });
}

/* ==========================================================================
   MODULES & LESSONS MUTATIONS
========================================================================== */

export function useCreateAdminModuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminModule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function useUpdateAdminModuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminModule> }) =>
      updateAdminModule(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function useDeleteAdminModuleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminModule(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function useCreateAdminLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminLesson,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function useUpdateAdminLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminLesson> }) =>
      updateAdminLesson(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

export function useDeleteAdminLessonMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminLesson(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.courses() });
    },
  });
}

/* ==========================================================================
   ENROLLMENTS HOOKS
========================================================================== */

export function useAdminEnrollments() {
  return useQuery({
    queryKey: adminLmsKeys.enrollments(),
    queryFn: fetchAdminEnrollments,
    staleTime: 30 * 1000,
  });
}

export function useGrantAdminEnrollmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: grantAdminEnrollment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.enrollments() });
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.analytics() });
    },
  });
}

/* ==========================================================================
   ORDERS HOOKS
========================================================================== */

export function useAdminOrders() {
  return useQuery({
    queryKey: adminLmsKeys.orders(),
    queryFn: fetchAdminOrders,
    staleTime: 30 * 1000,
  });
}

/* ==========================================================================
   COUPONS HOOKS
========================================================================== */

export function useAdminCoupons() {
  return useQuery({
    queryKey: adminLmsKeys.coupons(),
    queryFn: fetchAdminCoupons,
    staleTime: 60 * 1000,
  });
}

export function useCreateAdminCouponMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCoupon,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.coupons() });
    },
  });
}

/* ==========================================================================
   REVIEWS HOOKS
========================================================================== */

export function useAdminReviews() {
  return useQuery({
    queryKey: adminLmsKeys.reviews(),
    queryFn: fetchAdminReviews,
    staleTime: 30 * 1000,
  });
}

export function useModerateAdminReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, status }: { reviewId: string; status: 'APPROVED' | 'REJECTED' }) =>
      moderateAdminReview(reviewId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminLmsKeys.reviews() });
    },
  });
}

/* ==========================================================================
   ANALYTICS HOOKS
========================================================================== */

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminLmsKeys.analytics(),
    queryFn: fetchAdminAnalytics,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

/* ==========================================================================
   PAYMENTS HOOKS
========================================================================== */

export function useAdminPayments(
  params?: { page?: number; limit?: number; provider?: string; status?: string },
  options?: Omit<UseQueryOptions<AdminPaymentsResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminLmsKeys.paymentsList(params),
    queryFn: () => fetchAdminPayments(params),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
    ...options,
  });
}
