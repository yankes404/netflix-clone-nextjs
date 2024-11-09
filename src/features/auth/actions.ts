"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { db } from "@/db/utils";
import { accounts, users } from "@/db/schemas";

import { registerSchema, loginSchema } from "@/features/auth/schemas";
import { signIn } from "@/auth";

export const register = async (
    values: z.infer<typeof registerSchema>
) => {
    try {
        const validatedFields = registerSchema.safeParse(values);
        
        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const { name, email, password } = validatedFields.data;

        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)


        if (existingUser[0]) {
            return { error: "Email already in use" }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.insert(users)
            .values({
                name,
                email,
                password: hashedPassword
            });


        await signIn("credentials", { email, password, redirect: false });

        return { success: true }
    }
    catch {
        return { error: "Something went wrong" }
    }
}

export const login = async (
    values: z.infer<typeof loginSchema>
) => {
    try {
        const validatedFields = loginSchema.safeParse(values);
        
        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }

        const { email, password } = validatedFields.data;
        await signIn("credentials", { email, password, redirect: false });

        return { success: true }
    } catch(error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin")  {
                return { error: "Invalid Credentials" }
            }
        }

        return { error: "Something went wrong" }
    }
}

export const getProvider = async (id: string) => {
    const fetchedUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, id))

    const user = fetchedUsers[0];

    if (!user) {
        throw new Error(`User with ID: ${id}, does not exist`)
    }

    const fetchedAccounts = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, user.id))

    const account = fetchedAccounts[0];

    if (!account) return null;

    return account.provider ?? null;
}