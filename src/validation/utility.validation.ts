import z from "zod";


const emailSchema = z.string().email("invalid email");

const passwordSchema = z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(20, "Password cannot exceed 20 characters");

const searchTerm = z.string().trim();

const userId = z.string().trim();


export { emailSchema, passwordSchema, searchTerm, userId }