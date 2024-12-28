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
            <div className="w-screen max-w-screen-2xl mx-auto pb-16 px-4">
                {(isLoading || !data) ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, key) => (
                            <Skeleton className="w-full aspect-video" key={key} />
                        ))}
                    </div>
                ): (
                    <div className="w-full flex flex-col gap-10">
                        {data.map((record, key) => (
                            <div
                                key={key}
                                className="w-full flex flex-col gap-6"
                            >
                                <h2 className="text-xl font-semibold">
                                    {record.title}
                                </h2>
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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