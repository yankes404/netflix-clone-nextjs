"use client";

import { Category } from "@/features/categories/types";
import { getCategoryTitles } from "@/features/categories/utils";
import { useGetHomeRecords } from "@/features/tracks/api/use-get-home-records";
import { TrackCard } from "@/features/tracks/components/track-card";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Skeleton } from "@/components/ui/skeleton";

export const Client = () => {
    const { data, isLoading } = useGetHomeRecords();

    return (
        <>
            <Header />
            <Hero />
            <div className="w-screen px-4 pb-16 mx-auto max-w-screen-2xl">
                {(isLoading || !data) ? (
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, key) => (
                            <Skeleton className="w-full aspect-video" key={key} />
                        ))}
                    </div>
                ): (
                    <div className="flex flex-col w-full gap-10">
                        {data.map((record, key) => (
                            <div
                                key={key}
                                className="flex flex-col w-full gap-6"
                            >
                                <h2 className="text-xl font-semibold">
                                    {record.title}
                                </h2>
                                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {record.tracks.map((track) => (
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
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}