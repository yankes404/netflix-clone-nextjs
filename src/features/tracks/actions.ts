"use server";

import { episodes, tracks, watchTimes } from "@/db/schemas";
import { db } from "@/db/utils";
import { and, desc, eq } from "drizzle-orm";
import { Episode, HomePageDataRes, HomePageDataResRow, MiniEpisode, PopulatedSeason, SearchTracksProps, Track, TrackType } from "./types";
import { auth } from "@/auth";
import { Category } from "../categories/types";
import { homePageRecords } from "./constants";

export const getTrackById = async (
    id: string,
    episodeId?: string
) => {
    const session = await auth();

    if (!session || !session.user || !session.user.isSubscribed) return;

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
    
    const { time, error, episodeId: currentEpisodeId } = await getWatchTime(track.id, episodeId);

    const isError = !!error;

    if (isError) {
        return null;
    }

    if (track.type === TrackType.SERIE) {
        const currentEpisodes: Episode[] = await db.select()
            .from(episodes)
            .where(and(
                eq(episodes.trackId, id),
                currentEpisodeId ? eq(episodes.id, currentEpisodeId) : undefined,
            ))
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

        return { track, currentEpisode, seasons: populatedSeasons, nextEpisode, time }
    }

    return { track, time };
}

export const getWatchTime = async (
    trackId: string,
    episodeId?: string
) => {
    try {
        const session = await auth();
    
        if (!session || !session.user || !session.user.isSubscribed || !session.user.profileId) return { error: "Unauthorized" };

        const fetchedTracks = await db
            .select()
            .from(tracks)
            .where(
                eq(tracks.id, trackId)
            )
            .limit(1);
    
        const track = fetchedTracks[0];
    
        if (!track) {
            return { error: "Track not found" }
        }
        
        const fetchedWatchTimes = await db
            .select()
            .from(watchTimes)
            .where(and(
                eq(watchTimes.profileId, session.user.profileId),
                eq(watchTimes.trackId, trackId),
                episodeId ? eq(watchTimes.episodeId, episodeId) : undefined
            ))
            .orderBy(desc(watchTimes.updatedAt))
            .limit(1);
    
        const watchTime = fetchedWatchTimes[0];
    
        if (!watchTime) {
            return { time: 0, episodeId };
        }
    
        if (track.type === TrackType.SERIE) {
            if (!watchTime.episodeId) {
                return { error: "Something went wrong" }
            }
    
            return { episodeId: watchTime.episodeId, time: watchTime.time }
        }
    
        return { time: watchTime.time };
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error(error);
        }

        return { error: "Something went wrong" }
    }
}

interface SaveWatchTimeProps {
    time: number;
    trackId: string;
    episodeId?: string;
}

export const saveWatchTime = async ({
    time,
    trackId,
    episodeId
}: SaveWatchTimeProps) => {
    time = Math.floor(time);

    try {
        const session = await auth();
    
        if (!session || !session.user || !session.user.isSubscribed || !session.user.profileId) return { error: "Unauthorized" };
    
        const fetchedWatchTimes = await db
            .select()
            .from(watchTimes)
            .where(and(
                eq(watchTimes.trackId, trackId),
                eq(watchTimes.profileId, session.user.profileId),
                episodeId ? eq(watchTimes.episodeId, episodeId) : undefined,
            ));
    
        const isExist = !!fetchedWatchTimes[0];
    
        if (isExist) {
            await db
                .update(watchTimes)
                .set({ time, updatedAt: new Date() })
                .where(and(
                    eq(watchTimes.profileId, session.user.profileId),
                    eq(watchTimes.trackId, trackId),
                    eq(watchTimes.trackId, trackId),
                    episodeId ? eq(watchTimes.episodeId, episodeId) : undefined,
                ));
        } else {
            await db.insert(watchTimes)
                .values({
                    profileId: session.user.profileId,
                    trackId,
                    episodeId: episodeId,
                    time
                })
        }
    
        return { time }
    } catch (error) {
        if (process.env.NODE_ENV !== "production") {
            console.error("Error while saving watch_time", error);
        }

        return { error: "Something went wrong" }
    }
}

export const searchTracks = async ({
    search,
    types,
    categories
}: SearchTracksProps) => {
    const session = await auth();
    
    if (!session || !session.user || !session.user.isSubscribed) return [];

    const isOnlyMovies = types.includes(TrackType.MOVIE) && !types.includes(TrackType.SERIE);
    const isOnlySeries = types.includes(TrackType.SERIE) && !types.includes(TrackType.MOVIE);

    const isNoType = !types.includes(TrackType.MOVIE) && !types.includes(TrackType.SERIE);

    if (isNoType) {
        return [];
    }

    const fetchedTracks = await db
        .select()
        .from(tracks)

    const lowerSearch = search.toLowerCase();

    const populatedTracks = await Promise.all(
        fetchedTracks
        .filter((track) => {
            const lowerTitle = track.title.toLowerCase();
            return lowerSearch.includes(lowerTitle) || lowerTitle.includes(lowerSearch);
        })
        .filter((track) => {
            if (isOnlyMovies) {
                return track.type === TrackType.MOVIE;
            }

            if (isOnlySeries) {
                return track.type === TrackType.SERIE;
            }

            return true;
        })
        .filter((track) => {
            let allowed = false;

            track.categories.map((category) => {
                if (categories.includes(category as Category)) {
                    allowed = true;
                }
            });

            return allowed;
        })
    )

    return populatedTracks;
}

export const getHomeRecords = async (): Promise<HomePageDataRes> => {
    const session = await auth();
    
    if (!session || !session.user || !session.user.isSubscribed) return [];

    const initialData = homePageRecords;

    const ids = initialData.map((data) => data.trackIds.map((id) => id)).flat();

    const fetchedTracks = await Promise.all(
        ids.map(async(id) => {
            const fetchedTracks = await db
                .select()
                .from(tracks)
                .where(eq(tracks.id, id));

            return fetchedTracks[0] ?? null;
        })
        .filter((track) => track !== null)
    );

    const data = await Promise.all(
        initialData.map(async(row) => {
            const tracks = await Promise.all(
                row.trackIds
                    .map(async(id) => fetchedTracks.find((track) => track.id === id) ?? null)
            )

            const fixedTracks = tracks.filter((track) => track !== null);

            const rowData: HomePageDataResRow = {
                title: row.title,
                tracks: fixedTracks
            }

            return rowData;
        })
    )

    return data;
}

export const getRandomTrack = async () => {
    const session = await auth();
    
    if (!session || !session.user || !session.user.isSubscribed) return null;

    const allTracks = await db
        .select({ id: tracks.id })
        .from(tracks);

    const index = Math.floor(Math.random() * allTracks.length);
    const id = allTracks[index].id;

    const fetchedTracks = await db
        .select()
        .from(tracks)
        .where(eq(tracks.id, id));

    return fetchedTracks[0] as Track;
}