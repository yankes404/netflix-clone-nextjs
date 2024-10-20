import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator';
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/db/utils";
import { users } from "@/db/schemas";

import { loginSchema, registerSchema } from "../schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const app = new Hono()
    .post(
        "register",
        zValidator("json", registerSchema),
        async (c) => {
            try {
                const { name, email, password } = c.req.valid("json");
    
                const existingUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email))
                    .limit(1)
    
    
                if (existingUser[0]) {
                    return c.json({ error: "Email already in use" }, 403);
                }
    
                const hashedPassword = await bcrypt.hash(password, 10);
    
                await db.insert(users)
                    .values({
                        name,
                        email,
                        password: hashedPassword
                    });
    
    
                await signIn("credentials", { email, password, redirect: false });
    
                return c.json({ error: null })
            }
            catch {
                return c.json({ error: "Something went wrong" }, 500);
            }
        }
    )
    .post(
        "login",
        zValidator("json", loginSchema),
        async (c) => {
            try {
                const { email, password } = c.req.valid("json");
                await signIn("credentials", { email, password, redirect: false });

                return c.json({ error: null })
            } catch(error) {
                if (error instanceof AuthError) {
                    if (error.type === "CredentialsSignin")  {
                        return c.json({ error: "Invalid Credentials" })
                    }
                }
                return c.json({ error: "Something went wrong!" })
            }
        }
    )

export default app;