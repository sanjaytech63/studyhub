import { z } from 'zod';

export const createCourseSchema = z.object({
  title: z
    .string()
    .min(3, 'Course title must be at least 3 characters')
    .max(120, 'Course title cannot exceed 120 characters'),
  slug: z
    .string()
    .min(3, 'URL slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens'),
  subtitle: z
    .string()
    .max(200, 'Subtitle cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  outcomeDescription: z.string().optional().or(z.literal('')),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  categoryId: z.string().optional().or(z.literal('')),
  isFree: z.boolean(),
  price: z.number().min(0, 'Price must be 0 or greater'),
  thumbnailUrl: z.string().optional().or(z.literal('')),
});

export type CreateCourseFormValues = z.infer<typeof createCourseSchema>;
