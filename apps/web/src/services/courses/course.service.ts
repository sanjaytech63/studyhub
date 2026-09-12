import { apiClient } from '@/lib/api/api-client';
import type {
  CourseSummary,
  Course,
  CourseModule,
  Lesson,
  Category,
  Certificate,
  Review,
  ApiResponse,
  PaginationMeta,
} from '@studyhub/types';

export interface FetchCoursesParams {
  category?: string;
  level?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface EnrolledCourseItem {
  enrollmentId: string;
  enrolledAt: string | Date;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
    subtitle?: string | null;
    thumbnailUrl?: string | null;
    totalLessons: number;
    category?: { name: string } | null;
    instructor?: {
      user: {
        firstName: string;
        lastName?: string | null;
      };
    } | null;
  };
  progress: {
    progressPercent: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    lastAccessedLessonId?: string | null;
    isCompleted: boolean;
  };
}

export interface CouponValidationResponse {
  valid: boolean;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  originalPrice: number;
  finalPrice: number;
}

export async function fetchCourses(params?: FetchCoursesParams): Promise<{
  courses: CourseSummary[];
  pagination: PaginationMeta;
}> {
  const response = await apiClient.get<
    ApiResponse<CourseSummary[]> & { pagination: PaginationMeta }
  >('/courses', { params });
  return {
    courses: response.data.data ?? [],
    pagination: response.data.pagination,
  };
}

export async function fetchCourseBySlug(slug: string): Promise<
  Course & {
    modules: CourseModule[];
    reviews: Review[];
    totalDurationMinutes: number;
    totalLessonsCount: number;
  }
> {
  const response = await apiClient.get<
    ApiResponse<
      Course & {
        modules: CourseModule[];
        reviews: Review[];
        totalDurationMinutes: number;
        totalLessonsCount: number;
      }
    >
  >(`/courses/${slug}`);
  return response.data.data as Course & {
    modules: CourseModule[];
    reviews: Review[];
    totalDurationMinutes: number;
    totalLessonsCount: number;
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return response.data.data ?? [];
}

export async function fetchLessonContent(lessonId: string): Promise<
  Lesson & {
    hasFullAccess: boolean;
    isPreview: boolean;
    module: { id: string; title: string; courseId: string };
  }
> {
  const response = await apiClient.get<
    ApiResponse<
      Lesson & {
        hasFullAccess: boolean;
        isPreview: boolean;
        module: { id: string; title: string; courseId: string };
      }
    >
  >(`/lessons/${lessonId}/content`);
  return response.data.data as Lesson & {
    hasFullAccess: boolean;
    isPreview: boolean;
    module: { id: string; title: string; courseId: string };
  };
}

export async function updateLessonProgress(
  lessonId: string,
  data: { watchTimeSeconds: number; isCompleted: boolean },
): Promise<{
  lessonProgress: unknown;
  courseProgress: unknown;
  certificate: Certificate | null;
}> {
  const response = await apiClient.post<
    ApiResponse<{
      lessonProgress: unknown;
      courseProgress: unknown;
      certificate: Certificate | null;
    }>
  >(`/lessons/${lessonId}/progress`, data);
  return response.data.data as {
    lessonProgress: unknown;
    courseProgress: unknown;
    certificate: Certificate | null;
  };
}

export async function fetchEnrolledCourses(): Promise<EnrolledCourseItem[]> {
  const response = await apiClient.get<ApiResponse<EnrolledCourseItem[]>>('/me/courses');
  return response.data.data ?? [];
}

export async function createOrder(data: {
  courseId: string;
  couponCode?: string;
}): Promise<{ id: string; orderNumber: string; totalAmount: number }> {
  const response = await apiClient.post<
    ApiResponse<{ id: string; orderNumber: string; totalAmount: number }>
  >('/orders', data);
  return response.data.data as { id: string; orderNumber: string; totalAmount: number };
}

export async function createCheckoutSession(orderId: string): Promise<{
  isFree: boolean;
  orderId: string;
  orderNumber?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
}> {
  const response = await apiClient.post<
    ApiResponse<{
      isFree: boolean;
      orderId: string;
      orderNumber?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
    }>
  >('/payments/create-checkout-session', { orderId });
  return response.data.data as {
    isFree: boolean;
    orderId: string;
    orderNumber?: string;
    amount?: number;
    currency?: string;
    keyId?: string;
  };
}

export async function verifyPayment(data: {
  orderId: string;
  providerPaymentId: string;
  providerOrderId?: string;
  providerSignature?: string;
}): Promise<{ success: boolean; courseSlug: string }> {
  const response = await apiClient.post<ApiResponse<{ success: boolean; courseSlug: string }>>(
    '/payments/verify',
    data,
  );
  return response.data.data as { success: boolean; courseSlug: string };
}

export async function validateCoupon(data: {
  code: string;
  courseId: string;
}): Promise<CouponValidationResponse> {
  const response = await apiClient.post<ApiResponse<CouponValidationResponse>>(
    '/coupons/validate',
    data,
  );
  return response.data.data as CouponValidationResponse;
}

export async function verifyCertificate(code: string): Promise<{
  certificateCode: string;
  issueDate: string;
  pdfUrl?: string | null;
  verificationUrl: string;
  student: { name: string; avatarUrl?: string | null };
  course: { title: string; slug: string; instructorName: string };
}> {
  const response = await apiClient.get<
    ApiResponse<{
      certificateCode: string;
      issueDate: string;
      pdfUrl?: string | null;
      verificationUrl: string;
      student: { name: string; avatarUrl?: string | null };
      course: { title: string; slug: string; instructorName: string };
    }>
  >(`/certificates/${code}`);
  return response.data.data as {
    certificateCode: string;
    issueDate: string;
    pdfUrl?: string | null;
    verificationUrl: string;
    student: { name: string; avatarUrl?: string | null };
    course: { title: string; slug: string; instructorName: string };
  };
}

export async function fetchStudentCertificates(): Promise<Certificate[]> {
  const response = await apiClient.get<ApiResponse<Certificate[]>>('/me/certificates');
  return response.data.data ?? [];
}

export async function submitReview(data: {
  courseId: string;
  rating: number;
  title?: string;
  comment: string;
}): Promise<{ id: string }> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    `/courses/${data.courseId}/reviews`,
    data,
  );
  return response.data.data as { id: string };
}

export async function fetchWishlist(): Promise<CourseSummary[]> {
  const response = await apiClient.get<ApiResponse<CourseSummary[]>>('/me/wishlist');
  return response.data.data ?? [];
}

export async function addToWishlist(courseId: string): Promise<void> {
  await apiClient.post(`/courses/${courseId}/wishlist`);
}

export async function removeFromWishlist(courseId: string): Promise<void> {
  await apiClient.delete(`/courses/${courseId}/wishlist`);
}
