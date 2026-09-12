import axios from 'axios';
import { apiClient } from '@/lib/api/api-client';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    courses: number;
  };
}

export interface AdminModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  lessons: AdminLesson[];
}

export interface AdminLesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  type: 'VIDEO' | 'ARTICLE';
  durationMinutes: number;
  videoUrl?: string | null;
  contentMarkdown?: string | null;
  isFreePreview: boolean;
  orderIndex: number;
}

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  outcomeDescription?: string | null;
  level: string;
  price: number;
  originalPrice?: number | null;
  thumbnailUrl?: string | null;
  trailerVideoUrl?: string | null;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: string;
  categoryId?: string | null;
  category?: { id: string; name: string; slug: string } | null;
  instructorId?: string;
  instructor?: {
    id?: string;
    user: { firstName: string; lastName?: string | null; email: string };
  } | null;
  modules?: AdminModule[];
  _count?: {
    modules: number;
    enrollments: number;
    orders: number;
  };
}

export interface AdminEnrollment {
  id: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'REVOKED';
  enrolledAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName?: string | null;
  };
  course: {
    title: string;
    slug: string;
  };
}

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount: number;
  usageLimit?: number | null;
  timesUsed: number;
  isActive: boolean;
}

export interface AdminReview {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  createdAt: string;
  user: {
    firstName: string;
    lastName?: string | null;
    email: string;
  };
  course: {
    title: string;
    slug: string;
  };
}

export interface AdminAnalyticsKPIs {
  kpis: {
    totalStudents: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    totalRevenue: number;
    completionRate: number;
  };
  topCourses: Array<{
    id: string;
    title: string;
    slug: string;
    price: number;
    enrollmentsCount: number;
    revenue: number;
  }>;
}

/* ==========================================================================
   COURSES API
========================================================================== */

export async function fetchAdminCourses(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<AdminCourse[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminCourse[] }>('/admin/courses', {
    params,
  });
  return res.data.data ?? [];
}

export async function fetchAdminCourseById(id: string): Promise<AdminCourse> {
  const res = await apiClient.get<{ success: boolean; data: AdminCourse }>(`/admin/courses/${id}`);
  return res.data.data;
}

export async function createAdminCourse(data: {
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  outcomeDescription?: string;
  level: string;
  price: number;
  originalPrice?: number;
  thumbnailUrl?: string;
  trailerVideoUrl?: string;
  instructorId?: string;
  categoryId?: string;
}): Promise<AdminCourse> {
  const res = await apiClient.post<{ success: boolean; data: AdminCourse }>('/admin/courses', data);
  return res.data.data;
}

export async function updateAdminCourse(
  id: string,
  data: Partial<AdminCourse>,
): Promise<AdminCourse> {
  const res = await apiClient.patch<{ success: boolean; data: AdminCourse }>(
    `/admin/courses/${id}`,
    data,
  );
  return res.data.data;
}

export async function publishAdminCourse(courseId: string): Promise<void> {
  await apiClient.post(`/admin/courses/${courseId}/publish`);
}

export async function deleteAdminCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/admin/courses/${courseId}`);
}

/* ==========================================================================
   CATEGORIES API
========================================================================== */

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminCategory[] }>('/categories');
  return res.data.data ?? [];
}

export async function createAdminCategory(data: {
  name: string;
  slug: string;
  description?: string;
}): Promise<AdminCategory> {
  const res = await apiClient.post<{ success: boolean; data: AdminCategory }>(
    '/admin/categories',
    data,
  );
  return res.data.data;
}

export async function updateAdminCategory(
  id: string,
  data: { name?: string; slug?: string; description?: string },
): Promise<AdminCategory> {
  const res = await apiClient.patch<{ success: boolean; data: AdminCategory }>(
    `/admin/categories/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await apiClient.delete(`/admin/categories/${id}`);
}

/* ==========================================================================
   MODULES & LESSONS API
========================================================================== */

export async function createAdminModule(data: {
  courseId: string;
  title: string;
  description?: string;
  orderIndex?: number;
}): Promise<AdminModule> {
  const res = await apiClient.post<{ success: boolean; data: AdminModule }>('/admin/modules', data);
  return res.data.data;
}

export async function updateAdminModule(
  id: string,
  data: Partial<AdminModule>,
): Promise<AdminModule> {
  const res = await apiClient.patch<{ success: boolean; data: AdminModule }>(
    `/admin/modules/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteAdminModule(id: string): Promise<void> {
  await apiClient.delete(`/admin/modules/${id}`);
}

export async function createAdminLesson(data: {
  moduleId: string;
  title: string;
  slug: string;
  type: 'VIDEO' | 'ARTICLE';
  durationMinutes?: number;
  videoUrl?: string;
  contentMarkdown?: string;
  isFreePreview?: boolean;
  orderIndex?: number;
}): Promise<AdminLesson> {
  const res = await apiClient.post<{ success: boolean; data: AdminLesson }>('/admin/lessons', data);
  return res.data.data;
}

export async function updateAdminLesson(
  id: string,
  data: Partial<AdminLesson>,
): Promise<AdminLesson> {
  const res = await apiClient.patch<{ success: boolean; data: AdminLesson }>(
    `/admin/lessons/${id}`,
    data,
  );
  return res.data.data;
}

export async function deleteAdminLesson(id: string): Promise<void> {
  await apiClient.delete(`/admin/lessons/${id}`);
}

/* ==========================================================================
   ENROLLMENTS, ORDERS, COUPONS, REVIEWS & ANALYTICS API
========================================================================== */

export async function fetchAdminEnrollments(): Promise<AdminEnrollment[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminEnrollment[] }>(
    '/admin/enrollments',
  );
  return res.data.data ?? [];
}

export async function grantAdminEnrollment(data: {
  userId: string;
  courseId: string;
}): Promise<void> {
  await apiClient.post('/admin/enrollments/grant', data);
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminOrder[] }>('/admin/orders');
  return res.data.data ?? [];
}

export async function fetchAdminCoupons(): Promise<AdminCoupon[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminCoupon[] }>('/admin/coupons');
  return res.data.data ?? [];
}

export async function createAdminCoupon(data: {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
}): Promise<AdminCoupon> {
  const res = await apiClient.post<{ success: boolean; data: AdminCoupon }>('/admin/coupons', data);
  return res.data.data;
}

export async function fetchAdminReviews(): Promise<AdminReview[]> {
  const res = await apiClient.get<{ success: boolean; data: AdminReview[] }>('/admin/reviews');
  return res.data.data ?? [];
}

export async function moderateAdminReview(
  reviewId: string,
  status: 'APPROVED' | 'REJECTED',
): Promise<void> {
  await apiClient.patch(`/admin/reviews/${reviewId}/moderate`, { status });
}

export async function fetchAdminAnalytics(): Promise<AdminAnalyticsKPIs> {
  const res = await apiClient.get<{ success: boolean; data: AdminAnalyticsKPIs }>(
    '/admin/analytics',
  );
  return res.data.data;
}

/* ==========================================================================
   PAYMENTS API
========================================================================== */

export interface AdminPayment {
  id: string;
  orderId: string;
  provider: 'RAZORPAY' | 'STRIPE';
  providerPaymentId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  order?: {
    orderNumber: string;
    user: {
      email: string;
      firstName: string;
      lastName?: string | null;
    };
    course: {
      title: string;
      slug: string;
    };
  };
}

export interface AdminPaymentsResponse {
  payments: AdminPayment[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export async function fetchAdminPayments(params?: {
  page?: number;
  limit?: number;
  provider?: string;
  status?: string;
}): Promise<AdminPaymentsResponse> {
  const res = await apiClient.get<{
    success: boolean;
    data: AdminPayment[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number };
  }>('/admin/payments', { params });
  return {
    payments: res.data.data ?? [],
    pagination: res.data.pagination ?? {
      page: 1,
      limit: 20,
      totalCount: res.data.data?.length ?? 0,
      totalPages: 1,
    },
  };
}

/* ==========================================================================
   MEDIA UPLOAD API
========================================================================== */

export interface UploadMediaResponse {
  url: string;
  publicId: string;
  resourceType?: string;
  bytes?: number;
  format?: string;
  duration?: number;
}

export interface CloudinaryUploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: 'video' | 'image' | 'auto';
  eager?: string;
  eagerAsync?: boolean;
}

export async function getMediaUploadSignature(params?: {
  folder?: string;
  resourceType?: 'video' | 'image' | 'auto';
}): Promise<CloudinaryUploadSignature> {
  const res = await apiClient.post<{ success: boolean; data: CloudinaryUploadSignature }>(
    '/admin/media/signature',
    params || {},
  );
  return res.data.data;
}

export async function uploadAdminMedia(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadMediaResponse> {
  const isVideo =
    file.type.startsWith('video/') ||
    /\.(mp4|webm|mov|mkv|avi|wmv|m4v|3gp|flv|ogv|ts)$/i.test(file.name);
  const resourceType = isVideo ? 'video' : 'image';
  const folder = isVideo ? 'studyhub/courses/videos' : 'studyhub/courses/thumbnails';

  // Strategy 1: Direct signed client-to-Cloudinary upload
  // Bypasses Express proxy, avoids memory buffering and 60s socket timeout, provides true byte progress
  try {
    const sig = await getMediaUploadSignature({ resourceType, folder });
    if (sig?.signature && sig?.apiKey && sig?.cloudName) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('file', file);
      cloudinaryFormData.append('api_key', sig.apiKey);
      cloudinaryFormData.append('timestamp', sig.timestamp.toString());
      cloudinaryFormData.append('signature', sig.signature);
      cloudinaryFormData.append('folder', sig.folder);

      if (sig.eager) {
        cloudinaryFormData.append('eager', sig.eager);
        if (sig.eagerAsync) {
          cloudinaryFormData.append('eager_async', 'true');
        }
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

      // Use isolated axios call so auth tokens/cookies are not leaked to Cloudinary
      const cloudRes = await axios.post(uploadUrl, cloudinaryFormData, {
        timeout: 600000, // 10 minutes for huge uploads
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && progressEvent.total > 0) {
            const percent = Math.min(
              99,
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            );
            onProgress?.(percent);
          }
        },
      });

      if (cloudRes.data?.secure_url) {
        onProgress?.(100);
        return {
          url: cloudRes.data.secure_url,
          publicId: cloudRes.data.public_id,
          resourceType: cloudRes.data.resource_type,
          bytes: cloudRes.data.bytes,
          format: cloudRes.data.format,
          duration: cloudRes.data.duration,
        };
      }
    }
  } catch (directUploadErr) {
    console.warn(
      'Direct Cloudinary upload failed or was blocked, falling back to server proxy...',
      directUploadErr,
    );
  }

  // Strategy 2: Fallback to backend Express proxy (/admin/media/upload)
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post<{ success: boolean; data: UploadMediaResponse }>(
    '/admin/media/upload',
    formData,
    {
      timeout: 300000, // 5 minutes for video upload & transcoding
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.min(
            99,
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
          onProgress?.(percent);
        }
      },
    },
  );
  onProgress?.(100);
  return res.data.data;
}
