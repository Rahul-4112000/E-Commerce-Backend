import { email } from "zod";
import { z } from "zod/v3";

const emailSchema = z.object({
  email: z.string().email("invalid email"),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

const confirmPasswordSchema = z.object({
  confirmPassword: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerSchema = z.object({
  body: loginSchema.extend({
    confirmPassword: confirmPasswordSchema,
  }),
});
