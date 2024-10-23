import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { createProfileSchema } from "../schemas";
import { db } from "@/db/utils";
import { profiles } from "@/db/schemas";

const app = new Hono()
    .post(
        "/",
        zValidator("json", createProfileSchema),
        async (c) => {
            const { userId, name, image } = c.req.valid("json");

            if (!userId) {
                return c.json({ error: "No userId" }, 400);
            }

            // TODO: Check the limits

            await db.insert(profiles)
                .values({
                    userId,
                    name,
                    image
                });
            
            return c.json({ success: true })
        }
    );

export default app;