"use server";

import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/utils";
import { profileLists, profiles, tracks } from "@/db/schemas";

import { createProfileSchema } from "./schemas";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { Profile } from "./types";
import { Track } from "../tracks/types";

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

export const getProfileList = async () => {
    const session = await auth();
        
    if (!session || !session.user || !session.user.profileId) {
        return { error: "You must be signed in and have choosen profile" }
    }

    const profile = await getProfile(session.user.profileId);

    if (!profile) {
        return { error: "This profile does not exist!" }
    }

    const list = await db.select()
        .from(profileLists)
        .where(
            eq(profileLists.profileId, profile.id)
        );

    const populatedList = await Promise.all(
        list.map(async(list) => {
            const fetchedTracks = await db
                .select()
                .from(tracks)
                .where(eq(tracks.id, list.trackId))

            return {
                ...list,
                track: fetchedTracks[0]
            }
        })
    );

    return { list: populatedList };
}

export const addTrackToProfileList = async (trackId: string) => {
    const session = await auth();
        
    if (!session || !session.user || !session.user.profileId) {
        return { error: "You must be signed in and have choosen profile" }
    }

    const profile = await getProfile(session.user.profileId);

    if (!profile) {
        return { error: "This profile does not exist!" }
    }

    const fetchedTracks = await db.select()
        .from(tracks)
        .where(eq(tracks.id, trackId))
        .limit(1);


    const track = fetchedTracks[0];

    if (!track) {
        return { error: "Track not found" }
    }

    const rows = await db.insert(profileLists)
        .values({
            profileId: profile.id,
            trackId: track.id
        })
        .returning();

    const row = rows[0];

    return { success: true, id: row.id, trackId: row.trackId };
}

interface RemoveTrackFromProfileListProps {
    id?: string;
    trackId?: string;
}

export const removeTrackFromProfileList = async ({
    id,
    trackId
}: RemoveTrackFromProfileListProps) => {
    const currentId = id || trackId;
    const idKey = id ? "id" : "trackId";

    if (!currentId) {
        return { error: "No id given" }
    }

    const session = await auth();
        
    if (!session || !session.user || !session.user.profileId) {
        return { error: "You must be signed in and have choosen profile" }
    }

    const profile = await getProfile(session.user.profileId);

    if (!profile) {
        return { error: "This profile does not exist!" }
    }

    const likedTracks = await db.select()
        .from(profileLists)
        .where(
            and(
                eq(profileLists[idKey], currentId),
                eq(profileLists.profileId, profile.id),
            )
        )
        .limit(1);

    const likedTrack = likedTracks[0];

    if (!likedTrack) {
        return { error: "This track does not exist in your list!" }
    }

    await db.delete(profileLists)
        .where(
            and(
                eq(profileLists[idKey], currentId),
                eq(profileLists.profileId, profile.id),
            )
        );

    return { success: true, id: likedTrack.id, trackId: likedTrack.trackId };
}

export const checkIsTrackInProfile = async (trackId: string) => {
    const session = await auth();
        
    if (!session || !session.user || !session.user.profileId) {
        return { error: "You must be signed in and have choosen profile" }
    }

    const profile = await getProfile(session.user.profileId);

    if (!profile) {
        return { error: "This profile does not exist!" }
    }

    const fetchedTracks = await db
        .select()
        .from(profileLists)
        .where(and(
            eq(profileLists.profileId, session.user.profileId),
            eq(profileLists.trackId, trackId)
        ));

    return { isTrackIn: !!fetchedTracks[0] }
}