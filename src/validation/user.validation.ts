import z from 'zod';
import { passwordSchema } from './utility.validation';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters').optional(),
    phone: z.string().trim().max(20, 'Phone cannot exceed 20 characters').optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: passwordSchema,
      newPassword: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});
