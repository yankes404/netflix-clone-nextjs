"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/utils";
import { profiles } from "@/db/schemas";

import { createProfileSchema } from "./schemas";

export const createProfile = async (
    values: z.infer<typeof createProfileSchema>
) => {
    const validatedFields = createProfileSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { userId, name, image } = validatedFields.data;

    if (!userId) {
        return { error: "No userId" }
    }

    // TODO: Check the limits

    const profile = await db.insert(profiles)
        .values({
            userId,
            name,
            image
        })
        .returning()
    
    return { profile: profile[0] };
}

export const getProfiles = async (userId: string) => {
    const userProfiles = await db.select({
        id: profiles.id,
        name: profiles.name,
        image: profiles.image
    })
        .from(profiles)
        .where(eq(profiles.userId, userId));

    return userProfiles;
}

export const getProfile = async (profileId: string) => {
    const userProfiles = await db.select()
        .from(profiles)
        .where(eq(profiles.id, profileId))
        .limit(1);

    return userProfiles[0];
}