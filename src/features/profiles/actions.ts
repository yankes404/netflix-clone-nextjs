"use server";

import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/utils";
import { profiles } from "@/db/schemas";

import { createProfileSchema } from "./schemas";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Profile } from "./types";

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
        .returning();

    chooseProfile(profile[0].id);
    
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

export const getProfile = async (profileId: string): Promise<Profile | null> => {
    const session = await auth();
    
    if (!session || !session.user) return null;

    const userProfiles = await db.select()
        .from(profiles)
        .where(and(
            eq(profiles.userId, session.user.id),
            eq(profiles.id, profileId))   
        )
        .limit(1);

    return userProfiles[0];
}

export const chooseProfile = async (profileId: string) => {
    try {
        const session = await auth();
        
        if (!session || !session.user) {
            return { error: "You must be signed in to choose profile" }
        }
    
        const profile = await getProfile(profileId);
    
        if (!profile) {
            return { error: "This profile does not exist!" }
        }

        cookies().set("ync-profile-id", profileId);
    
        return { success: true }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}