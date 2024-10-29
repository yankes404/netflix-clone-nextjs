"use server";

import { episodes, tracks } from "@/db/schemas";
import { db } from "@/db/utils";
import { eq } from "drizzle-orm";
import { Episode, MiniEpisode, PopulatedSeason, Track, TrackType } from "./types";

export const getTrackById = async (id: string) => {
    function reduceArray(arr: number[]): number[] {
        const uniqueArray = Array.from(new Set(arr));
        uniqueArray.sort((a, b) => a - b);
        return uniqueArray;
    }

    const fetchedTracks: Track[] = await db.select()
        .from(tracks)
        .where(eq(tracks.id, id))

    const track = fetchedTracks[0];

    if (!track) return null;

    if (track.type === TrackType.SERIE) {
        const currentEpisodes: Episode[] = await db.select()
            .from(episodes)
            .where(eq(episodes.trackId, id))
            .limit(1)

        const currentEpisode = currentEpisodes[0];

        if (!currentEpisode) return null;

        const populatedEpisodes = await db.select({ id: episodes.id, title: episodes.title, season: episodes.season })
            .from(episodes)
            .where(eq(episodes.trackId, id))

        const currentEpisodeIndex = populatedEpisodes.findIndex(({ id }) => id === currentEpisode.id);

        if (currentEpisodeIndex === -1) {
            return null;
        }
        
        const seasonNumbers = await Promise.all(
            populatedEpisodes.map((currentEpisode) => currentEpisode.season)
        )

        const reducedSeasonNumbers = reduceArray(seasonNumbers);

        const populatedSeasons: PopulatedSeason[] = reducedSeasonNumbers.map((number) => ({
            title: `Season ${number + 1}`,
            episodes: []
        }));


        Promise.all(
            populatedEpisodes.map((currentEpisode) => populatedSeasons[currentEpisode.season].episodes.push(currentEpisode))
        );

        const nextEpisodeIndex = currentEpisodeIndex + 1;
        const nextEpisode: MiniEpisode | null = populatedEpisodes[nextEpisodeIndex] ?? null;

        return { track, currentEpisode, seasons: populatedSeasons, nextEpisode }
    }

    return { track };
    
    // console.log(crypto.randomUUID());
}