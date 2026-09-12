import { z } from 'zod';

/* ==========================================================================
   COMMON VALIDATION SCHEMAS
========================================================================== */

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const uuidParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format' }),
});

export const slugParamSchema = z.object({
  slug: z
    .string()
    .min(2)
    .max(280)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase alphanumeric and hyphens only',
    }),
});

/* ==========================================================================
   CATEGORY SCHEMAS
========================================================================== */

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(500).optional(),
  icon: z.string().max(100).optional(),
  orderIndex: z.number().int().default(0),
});

export const updateCategorySchema = createCategorySchema.partial();

/* ==========================================================================
   COURSE SCHEMAS
========================================================================== */

export const courseQuerySchema = paginationQuerySchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isFree: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isBestseller: z.coerce.boolean().optional(),
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  sort: z
    .enum(['newest', 'popular', 'price-low', 'price-high', 'highest-rated'])
    .optional()
    .default('newest'),
});

export const createCourseSchema = z.object({
  title: z.string().min(3).max(255),
  slug: z
    .string()
    .min(3)
    .max(280)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be URL friendly (lowercase letters, numbers, hyphens)',
    }),
  subtitle: z.string().max(500).optional(),
  description: z.string().min(20),
  outcomeDescription: z.string().optional(), // What You'll Build architecture
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS']).default('ALL_LEVELS'),
  language: z.string().default('English'),
  price: z.coerce.number().min(0).default(0),
  originalPrice: z.coerce.number().min(0).optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  trailerVideoUrl: z.string().url().optional().or(z.literal('')),
  categoryId: z.string().uuid().optional(),
  instructorId: z.string().uuid(),
  prerequisites: z.array(z.string()).optional().default([]),
  learningOutcomes: z.array(z.string()).optional().default([]),
  targetAudience: z.array(z.string()).optional().default([]),
  technologies: z
    .array(
      z.object({
        technologyId: z.string().uuid(),
        orderIndex: z.number().int().default(0),
      }),
    )
    .optional(),
});

export const updateCourseSchema = createCourseSchema.partial().extend({
  status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']).optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
});

/* ==========================================================================
   MODULE & LESSON SCHEMAS
========================================================================== */

export const createModuleSchema = z.object({
  courseId: z.string().uuid(),
  title: z.string().min(2).max(255),
  description: z.string().optional(),
  orderIndex: z.number().int().default(0),
});

export const updateModuleSchema = createModuleSchema.omit({ courseId: true }).partial();

export const createLessonSchema = z.object({
  moduleId: z.string().uuid(),
  title: z.string().min(2).max(255),
  slug: z
    .string()
    .min(2)
    .max(280)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  type: z
    .enum(['VIDEO', 'ARTICLE', 'QUIZ', 'ASSIGNMENT', 'PROJECT', 'RESOURCE', 'LIVE_SESSION'])
    .default('VIDEO'),
  durationMinutes: z.coerce.number().int().min(0).default(0),
  videoUrl: z.string().url().optional().or(z.literal('')),
  contentMarkdown: z.string().optional(),
  isFreePreview: z.boolean().default(false),
  dripDelayDays: z.coerce.number().int().min(0).default(0),
  orderIndex: z.number().int().default(0),
});

export const updateLessonSchema = createLessonSchema.omit({ moduleId: true }).partial();

/* ==========================================================================
   PROGRESS & COMPLETION
========================================================================== */

export const updateProgressSchema = z.object({
  watchTimeSeconds: z.coerce.number().int().min(0).default(0),
  isCompleted: z.boolean().default(false),
});

/* ==========================================================================
   CHECKOUT, ORDERS & PAYMENTS
========================================================================== */

export const createOrderSchema = z.object({
  courseId: z.string().uuid({ message: 'Valid courseId is required' }),
  couponCode: z.string().trim().toUpperCase().optional(),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  provider: z.enum(['RAZORPAY', 'STRIPE']).default('RAZORPAY'),
  providerOrderId: z.string().optional(),
  providerPaymentId: z.string().min(1, 'Payment ID is required'),
  providerSignature: z.string().optional(),
});

/* ==========================================================================
   COUPONS
========================================================================== */

export const createCouponSchema = z.object({
  code: z.string().trim().min(3).max(50).toUpperCase(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.coerce.number().min(1),
  maxDiscount: z.coerce.number().min(0).optional(),
  minOrderAmount: z.coerce.number().min(0).default(0),
  usageLimit: z.coerce.number().int().min(1).optional(),
  validFrom: z.coerce.date().default(() => new Date()),
  validTo: z.coerce.date().optional(),
  isActive: z.boolean().default(true),
});

export const validateCouponSchema = z.object({
  code: z.string().trim().toUpperCase(),
  courseId: z.string().uuid(),
});

/* ==========================================================================
   REVIEWS & RATINGS
========================================================================== */

export const createReviewSchema = z.object({
  courseId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
});

export const moderateReviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'FLAGGED']),
});
