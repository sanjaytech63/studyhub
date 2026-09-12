import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import {
  fetchEnrolledCourses,
  fetchLessonContent,
  updateLessonProgress,
  fetchStudentCertificates,
  verifyCertificate,
  validateCoupon,
  createOrder,
  createCheckoutSession,
  verifyPayment,
  type EnrolledCourseItem,
  type CouponValidationResponse,
} from '@/services/courses/course.service';
import type { Certificate, Lesson } from '@studyhub/types';

export const learningKeys = {
  all: ['learning'] as const,
  enrollments: () => [...learningKeys.all, 'enrollments'] as const,
  lesson: (lessonId: string) => [...learningKeys.all, 'lesson', lessonId] as const,
  certificates: () => [...learningKeys.all, 'certificates'] as const,
  verifyCertificate: (code: string) => [...learningKeys.all, 'verify-cert', code] as const,
};

export function useEnrolledCourses(
  options?: Omit<UseQueryOptions<EnrolledCourseItem[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: learningKeys.enrollments(),
    queryFn: fetchEnrolledCourses,
    staleTime: 60 * 1000,
    ...options,
  });
}

export function useLessonContent(
  lessonId: string,
  options?: Omit<
    UseQueryOptions<
      Lesson & {
        hasFullAccess: boolean;
        isPreview: boolean;
        module: { id: string; title: string; courseId: string };
      }
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: learningKeys.lesson(lessonId),
    queryFn: () => fetchLessonContent(lessonId),
    enabled: Boolean(lessonId),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
}

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      watchTimeSeconds,
      isCompleted,
    }: {
      lessonId: string;
      watchTimeSeconds: number;
      isCompleted: boolean;
    }) => updateLessonProgress(lessonId, { watchTimeSeconds, isCompleted }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: learningKeys.enrollments() });
      void queryClient.invalidateQueries({ queryKey: learningKeys.certificates() });
    },
  });
}

export function useStudentCertificates(
  options?: Omit<UseQueryOptions<Certificate[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: learningKeys.certificates(),
    queryFn: fetchStudentCertificates,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

export function useVerifyCertificate(
  code: string,
  options?: Omit<
    UseQueryOptions<{
      certificateCode: string;
      issueDate: string;
      pdfUrl?: string | null;
      verificationUrl: string;
      student: { name: string; avatarUrl?: string | null };
      course: { title: string; slug: string; instructorName: string };
    }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: learningKeys.verifyCertificate(code),
    queryFn: () => verifyCertificate(code),
    enabled: Boolean(code),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useValidateCoupon() {
  return useMutation<CouponValidationResponse, Error, { code: string; courseId: string }>({
    mutationFn: validateCoupon,
  });
}

export function useCreateOrder() {
  return useMutation<
    { id: string; orderNumber: string; totalAmount: number },
    Error,
    { courseId: string; couponCode?: string }
  >({
    mutationFn: createOrder,
  });
}

export function useCreateCheckoutSession() {
  return useMutation<
    {
      isFree: boolean;
      orderId: string;
      orderNumber?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
    },
    Error,
    { orderId: string }
  >({
    mutationFn: ({ orderId }) => createCheckoutSession(orderId),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean; courseSlug: string },
    Error,
    {
      orderId: string;
      providerPaymentId: string;
      providerOrderId?: string;
      providerSignature?: string;
    }
  >({
    mutationFn: verifyPayment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: learningKeys.enrollments() });
    },
  });
}
