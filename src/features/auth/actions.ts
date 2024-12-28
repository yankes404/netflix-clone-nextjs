"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import { db } from "@/db/utils";
import { accounts, users, verificationTokens } from "@/db/schemas";

import { registerSchema, loginSchema } from "@/features/auth/schemas";
import { auth, signIn } from "@/auth";
import { getResend } from "../mails/utils";
import { VerificationTokenTemplate } from "../mails/components/verification-token-template";
import { getStripe } from "../subscriptions/utils";

const stripe = getStripe();
const resend = getResend();

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
                password: hashedPassword,
                emailVerified: process.env.NEXT_PUBLIC_USE_RESEND === "TRUE" ? null : new Date()
            });

        if (process.env.NEXT_PUBLIC_USE_RESEND === "TRUE") {
            const { error: verificationTokenError } = await createVerificationToken(
                email,
                name,
                true
            );
    
            if (verificationTokenError) return { error: verificationTokenError }
        }

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

export const createVerificationToken = async (
    email: string,
    name: string,
    newUser?: boolean
) => {
    let userEmail = email;

    if (!newUser) {
        const session = await auth();

        if (!session || !session.user) return { error: "Not logged in" };
        
        userEmail = session.user.email;
        
        if (session.user.emailVerified && email === userEmail) return { error: "You already have verified email address" }
    }

    async function send () {        
        try {
            const createdTokens = await db
                .insert(verificationTokens)
                .values({
                    userEmail,
                    expectedEmail: email
                })
                .returning();

            const token = createdTokens[0];

            if (process.env.NEXT_PUBLIC_USE_RESEND === "TRUE") {
                const { error } = await resend.emails.send({
                    from: `Netflix Clone <${process.env.NEXT_PUBLIC_EMAIL_ADDRESS!}>`,
                    to: [email],
                    subject: "Email Verification",
                    react: VerificationTokenTemplate({ email, name, token: token.token })
                });
    
                if (error) {
                    if (process.env.NODE_ENV !== "production") {
                        console.error(error);
                    }
                    
                    return { error: "Something went wrong" }
                }
            }

            return { success: true }
        } catch (error) {
            if (process.env.NODE_ENV !== "production") {
                console.error(error);
            }

            return { error: "Something went wrong" }
        }
    }

    try {
        const fetchedTokens = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.userEmail, userEmail))

        const token = fetchedTokens[0];

        if (token) {
            const isExpired = new Date().getTime() > token.expiresAt.getTime();

            if (isExpired || (token.expectedEmail !== email)) {
                await db
                    .delete(verificationTokens)
                    .where(eq(verificationTokens.token, token.token));

                return await send();

            } else {
                const minutes = Math.floor((token.expiresAt.getTime() - new Date().getTime()) / 60_000);
                return { error: `You have to wait ${minutes} minutes before you can sand next verification email` }
            }
        } else return await send();
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}

export const checkVerificationToken = async (token: string) => {
    try {
        const fetchedTokens = await db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.token, token))

        const tokenData = fetchedTokens[0];
    
        if (!tokenData) {
            return { error: "Token does not exist" }
        }
    
        const isExpired = new Date().getTime() > tokenData.expiresAt.getTime();
    
        if (isExpired) {
            return { error: "Token is expired" }
        }

        const fetchedUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, tokenData.userEmail))

        const user = fetchedUsers[0];
        
        if (!user) {
            return { error: "User with that email address does not exist" }
        }

        await db
            .delete(verificationTokens)
            .where(eq(verificationTokens.token, token))
    
        await db
            .update(users)
            .set({ emailVerified: new Date(), email: tokenData.expectedEmail })
            .where(eq(users.id, user.id))

        if (user.customerId) {
            await stripe.customers.update(
                user.customerId,
                {
                    email: tokenData.expectedEmail
                }
            )
        }

        return { success: true }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}