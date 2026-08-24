import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name must contain at least 2 characters.')
    .max(100, 'First name cannot exceed 100 characters.'),

  lastName: z
    .string()
    .trim()
    .max(100, 'Last name cannot exceed 100 characters.')
    .optional()
    .or(z.literal('')),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
