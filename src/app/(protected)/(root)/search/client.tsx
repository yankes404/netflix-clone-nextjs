"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { allCategories } from "@/features/categories/constants";
import { Category } from "@/features/categories/types";
import { getAllCategoriesIds, getCategoryTitles } from "@/features/categories/utils";
import { useSearchTracks } from "@/features/tracks/api/use-search-tracks";
import { TrackCard } from "@/features/tracks/components/track-card";
import { TrackType } from "@/features/tracks/types";
import { SearchIcon } from "lucide-react"
import { useDebounce } from 'use-debounce';

import { parseAsArrayOf, parseAsBoolean, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs'

interface Props {
    title?: string;
    showSeriesAndMoviesFilter?: boolean;
    defaultSeries?: boolean;
    defaultMovies?: boolean;
}

export const SearchClient = ({
    title = "Search",
    showSeriesAndMoviesFilter = true,
    defaultSeries = true,
    defaultMovies = true
}: Props) => {
    const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));

    const [isMovies, setIsMovies] = useQueryState(
        "movies",
        parseAsBoolean.withDefault(defaultSeries)
    );

    const [isSeries, setIsSeries] = useQueryState(
        "series",
        parseAsBoolean.withDefault(defaultMovies)
    );

    const [categories, setCategories] = useQueryState(
        "categories",
        parseAsArrayOf(parseAsStringEnum(getAllCategoriesIds())).withDefault(getAllCategoriesIds())
    )

    const [debouncedSearch] = useDebounce(search, 1000);

    const getTypes = () => {
        const types: TrackType[] = [];

        if (isMovies) types.push(TrackType.MOVIE);
        if (isSeries) types.push(TrackType.SERIE);

        return types;
    }

    const { data: tracks, isLoading } = useSearchTracks({
        search: debouncedSearch,
        types: getTypes(),
        categories
    });

    const changeCategory = (id: Category, value: boolean) => {
        setCategories((prev) => {
            if (value) {
                return [...prev, id];
            } else {
                return prev.filter((prevId) => prevId !== id);
            }
        });
    }

    return (
        <div className="mt-16 w-full">
            <div className="w-full flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold">
                    {title}
                </h1>
                <div className="relative mt-4">
                    <SearchIcon className="size-4 text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" />
                    <Input
                        className="w-[440px] pl-10"
                        placeholder="Search anything..."
                        value={search ?? ""}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 mt-3">
                    {showSeriesAndMoviesFilter && (
                        <>
                            <Button
                                size="sm"
                                variant={isMovies ? "foreground" : "outline"}
                                onClick={() => setIsMovies((prev) => !prev)}
                            >
                                Movies
                            </Button>
                            <Button
                                size="sm"
                                variant={isSeries ? "foreground" : "outline"}
                                onClick={() => setIsSeries((prev) => !prev)}
                            >
                                Series
                            </Button>
                        </>
                    )}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                size="sm"
                            >
                                Categories
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 flex flex-col gap-y-3 max-h-64 overflow-y-auto categories-popover" align="center" sideOffset={10}>
                            {allCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center gap-1.5"
                                >
                                    <Checkbox
                                        id={category.id}
                                        checked={categories.includes(category.id)}
                                        onCheckedChange={(value) => typeof value === "boolean" && changeCategory(category.id, value)}
                                    />
                                    <Label htmlFor={category.id}>
                                        {category.title}
                                    </Label>
                                </div>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="w-full mt-8">
                <h2 className="text-lg font-semibold">
                    Found <span className="text-red-500">{tracks?.length.toLocaleString("en-US")} results</span>
                </h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-4 gap-4">
                    {isLoading ? Array.from({ length: 10 }).map((_, key) => (
                        <Skeleton
                            key={key}
                            className="w-full aspect-video"
                        />
                    )) : tracks?.map((track) => (
                        <TrackCard
                            key={track.id}
                            id={track.id}
                            title={track.title}
                            image={track.poster}
                            tags={getCategoryTitles(track.categories as Category[])}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}