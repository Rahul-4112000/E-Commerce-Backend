import z from "zod";


const emailSchema = z.string().email("invalid email");

const passwordSchema = z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password cannot exceed 20 characters");


export { emailSchema, passwordSchema }