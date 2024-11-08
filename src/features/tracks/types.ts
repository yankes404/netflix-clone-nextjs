import { episodes, tracks } from "@/db/schemas";
import { InferSelectModel } from "drizzle-orm";
import { Category } from "../categories/types";

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

export interface SearchTracksProps {
    search: string;
    types: TrackType[];
    categories: Category[];
}

export type HomePageDataRow = {
    title: string;
    trackIds: string[];
};

export type HomePageData = Array<HomePageDataRow>;

export type HomePageDataResRow = Omit<HomePageDataRow, "trackIds"> & {
    tracks: Track[];
}
export type HomePageDataRes = Array<HomePageDataResRow>