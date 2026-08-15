import { z } from 'zod';

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must contain at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.'),

  email: z.string().trim().email('Please enter a valid email address.'),

  bio: z.string().trim().max(500, 'Bio must not exceed 500 characters.'),

  location: z.string().trim().max(100, 'Location must not exceed 100 characters.'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
