import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Required"),
    password: z.string().min(1, "Required")
});

export const registerSchema = z.object({
    name: z.string().trim().min(1, "Required"),
    email: z.string().email("Required"),
    password: z.string().min(8, "8 characters required")
});