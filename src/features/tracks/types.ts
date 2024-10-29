import { episodes, tracks } from "@/db/schemas";
import { InferSelectModel } from "drizzle-orm";

export type Track = InferSelectModel<typeof tracks>;
export enum TrackType {
    MOVIE = "movie",
    SERIE = "serie"
}

export type Episode = InferSelectModel<typeof episodes>;
export type MiniEpisode = Pick<Episode, 'id' | 'title' | 'season'>;

export interface PopulatedSeason {
    title: string;
    episodes: MiniEpisode[];
}