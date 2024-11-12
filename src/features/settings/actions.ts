"use server";

import { auth } from "@/auth";
import { EditUserEmailType, EditUserNameType, EditUserPasswordType } from "./types";
import { editUserEmailSchema, editUserNameSchema, editUserPasswordSchema } from "./schemas";
import { db } from "@/db/utils";
import { users } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { createVerificationToken, getProvider } from "../auth/actions";
import bcrypt from "bcryptjs";

export const updateUserName = async (values: EditUserNameType) => {
    try {
        const session = await auth();
    
        if (!session || !session.user) {
            return { error: "Unauthorized" }
        }
    
        const validatedFields = editUserNameSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }
        
        const { name } = validatedFields.data;
    
        const fetchedUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, session.user.id));
    
        const user = fetchedUsers[0] ?? null;
    
        if (!user) {
            return { error: "User does not exist" }
        }
    
        if (user.name === name) {
            return { error: "No change has been made" }
        }
    
        await db
            .update(users)
            .set({ name })
            .where(eq(users.id, session.user.id));

        return { success: true }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}

export const updateUserEmail = async (values: EditUserEmailType) => {
    try {
        const session = await auth();
    
        if (!session || !session.user) {
            return { error: "Unauthorized" }
        }
    
        const validatedFields = editUserEmailSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }
        
        const { email } = validatedFields.data;
    
        const fetchedUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, session.user.id));
    
        const user = fetchedUsers[0] ?? null;
    
        if (!user) {
            return { error: "User does not exist" }
        }
    
        if (user.email === email) {
            return { error: "No change has been made" }
        }
    
        const provider = await getProvider(user.id);

        if (provider) {
            return { error: "You cannot update your email address when you logged in by Google or Github" }
        }

        const { error } = await createVerificationToken(email, user.name ?? "CANNOT_READ_USER_NAME");

        if (error) {
            return { error }
        }

        return { success: true }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}

export const updateUserPassword = async (values: EditUserPasswordType) => {
    try {
        const session = await auth();
    
        if (!session || !session.user) {
            return { error: "Unauthorized" }
        }
    
        const validatedFields = editUserPasswordSchema.safeParse(values);
    
        if (!validatedFields.success) {
            return { error: "Invalid fields" }
        }
        
        const { password } = validatedFields.data;
    
        const fetchedUsers = await db
            .select()
            .from(users)
            .where(eq(users.id, session.user.id));
    
        const user = fetchedUsers[0] ?? null;
    
        if (!user) {
            return { error: "User does not exist" }
        }
    
        const provider = await getProvider(user.id);

        if (provider) {
            return { error: "You cannot update your password when you logged in by Google or Github" }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.id, session.user.id));

        return { success: true }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}