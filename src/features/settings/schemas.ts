import { z } from "zod";

export const editUserNameSchema = z.object({
    name: z.string().trim().min(1, "Required")
});

export const editUserEmailSchema = z.object({
    email: z.string().email("Required"),
});

export const editUserPasswordSchema = z.object({
    password: z.string().min(8, "8 characters required")
});