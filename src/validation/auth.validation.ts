import z from 'zod';
import { emailSchema, passwordSchema } from './utility.validation';

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerSchema = z.object({
  body: loginSchema.shape.body
    .extend({
      confirmPassword: passwordSchema,
      name: z.string().min(1, { message: 'Name is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

const adminRegisterSchema = z.object({
  body: z
    .object({
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

export { adminRegisterSchema };
