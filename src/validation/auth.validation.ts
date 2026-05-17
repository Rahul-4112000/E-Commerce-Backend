import z from "zod";
import { emailSchema, passwordSchema } from "./utility.validation";

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const registerSchema = z.object({
  body: loginSchema.extend({
    confirmPassword: passwordSchema,
  }),
});


const adminRegisterSchema = z.object({
  body: z.object({
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
})


export { adminRegisterSchema }