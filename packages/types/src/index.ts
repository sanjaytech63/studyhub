/* ==========================================================================
   STUDYHUB CORE DOMAIN TYPES
========================================================================== */

/* --------------------------------------------------------------------------
   Common / API Envelopes
-------------------------------------------------------------------------- */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

/* --------------------------------------------------------------------------
   Auth & RBAC
-------------------------------------------------------------------------- */

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
export type RoleType = 'SYSTEM' | 'CUSTOM';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
  emailVerifiedAt?: string | Date | null;
  role: {
    id: string;
    name: string;
    description?: string | null;
    type: RoleType;
  };
  createdAt: string | Date;
}

export interface InstructorProfile {
  id: string;
  userId: string;
  headline?: string | null;
  bio?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  user?: UserProfile;
}

/* --------------------------------------------------------------------------
   Courses & Technology
-------------------------------------------------------------------------- */

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type CourseStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  orderIndex: number;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Infrastructure' | 'DevOps' | 'Testing' | string;
  iconUrl?: string | null;
}

export interface CourseTechnology {
  courseId: string;
  technologyId: string;
  orderIndex: number;
  technology: Technology;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  outcomeDescription?: string | null; // What You'll Build Architecture description
  level: CourseLevel;
  language: string;
  price: number;
  originalPrice?: number | null;
  status: CourseStatus;
  thumbnailUrl?: string | null;
  trailerVideoUrl?: string | null;
  isFeatured: boolean;
  isBestseller: boolean;
  prerequisites?: string[] | null;
  learningOutcomes?: string[] | null;
  targetAudience?: string[] | null;
  categoryId?: string | null;
  category?: Category | null;
  instructorId: string;
  instructor: InstructorProfile;
  technologies?: CourseTechnology[];
  modules?: CourseModule[];
  enrollmentCount?: number;
  rating?: number;
  reviewCount?: number;
  totalDurationMinutes?: number;
  totalLessonsCount?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  level: CourseLevel;
  language: string;
  price: number;
  originalPrice?: number | null;
  thumbnailUrl?: string | null;
  isFeatured: boolean;
  isBestseller: boolean;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  instructor: {
    id: string;
    headline?: string | null;
    user: {
      firstName: string;
      lastName?: string | null;
      avatarUrl?: string | null;
    };
  };
  rating: number;
  reviewCount: number;
  enrollmentCount: number;
  totalDurationMinutes: number;
  totalLessonsCount: number;
}

/* --------------------------------------------------------------------------
   Curriculum, Modules & Lessons
-------------------------------------------------------------------------- */

export type LessonType =
  'VIDEO' | 'ARTICLE' | 'QUIZ' | 'ASSIGNMENT' | 'PROJECT' | 'RESOURCE' | 'LIVE_SESSION';

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  fileUrl: string;
  fileType?: string | null;
  sizeBytes?: number | string | null;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  type: LessonType;
  durationMinutes: number;
  videoUrl?: string | null;
  contentMarkdown?: string | null;
  isFreePreview: boolean;
  dripDelayDays: number;
  orderIndex: number;
  resources?: LessonResource[];
  isCompleted?: boolean;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  lessons: Lesson[];
  totalDurationMinutes?: number;
}

/* --------------------------------------------------------------------------
   Enrollment & Progress
-------------------------------------------------------------------------- */

export type EnrollmentStatus = 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'REVOKED';
export type ProgressStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string | Date;
  expiresAt?: string | Date | null;
  course?: CourseSummary;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  watchTimeSeconds: number;
  completedAt?: string | Date | null;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  progressPercent: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  lastAccessedLessonId?: string | null;
  completedAt?: string | Date | null;
}

/* --------------------------------------------------------------------------
   Certificates
-------------------------------------------------------------------------- */

export interface Certificate {
  id: string;
  certificateCode: string;
  userId: string;
  courseId: string;
  issueDate: string | Date;
  pdfUrl?: string | null;
  verificationUrl: string;
  user?: {
    firstName: string;
    lastName?: string | null;
    email: string;
  };
  course?: {
    title: string;
    slug: string;
    instructor: {
      user: {
        firstName: string;
        lastName?: string | null;
      };
    };
  };
}

/* --------------------------------------------------------------------------
   Orders, Payments & Coupons
-------------------------------------------------------------------------- */

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentProvider = 'STRIPE' | 'RAZORPAY' | 'MANUAL';
export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderAmount: number;
  usageLimit?: number | null;
  timesUsed: number;
  validFrom: string | Date;
  validTo?: string | Date | null;
  isActive: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  courseId: string;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  couponId?: string | null;
  createdAt: string | Date;
  course?: CourseSummary;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string | Date;
}

/* --------------------------------------------------------------------------
   Reviews & Wishlist
-------------------------------------------------------------------------- */

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  title?: string | null;
  comment: string;
  status: ReviewStatus;
  user?: {
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
  createdAt: string | Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  courseId: string;
  course: CourseSummary;
  createdAt: string | Date;
}

/* --------------------------------------------------------------------------
   Notifications
-------------------------------------------------------------------------- */

export type NotificationType =
  | 'COURSE_ENROLLMENT'
  | 'COURSE_PUBLISHED'
  | 'PAYMENT_SUCCESS'
  | 'CERTIFICATE_GENERATED'
  | 'NEW_COURSE'
  | 'ANNOUNCEMENT'
  | 'PROMOTION'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  dataJson?: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string | Date;
}
