"use client";

import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrackCard } from "@/features/tracks/components/track-card";
import Link from "next/link";

export const Client = () => {
    return (
        <>
            <Header />
            <Hero />
            <div className="w-screen max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-16 px-4 -mt-6">
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="fast-and-furious-9"
                    title="Fast and Furious 9"
                    lenght={5040}
                    image={"/series-and-movies/backgrounds/FastAndFurious9.webp"}
                    tags={["Action", "Drama"]}
                />
            </div>
            <footer className="mt-4 w-screen bg-neutral-900 border-t">
                <div className="w-full max-w-screen-2xl mx-auto py-6 flex items-center justify-between gap-6">
                    <p className="text-sm font-medium">
                        &copy; Netflix Clone, Next 14 2024. Created by <Link href="https://github.com/yankes404" target="_blank"><span className="text-red-500 hover:underline">yankes404</span></Link>
                    </p>
                    <div className="text-sm flex items-center gap-x-3 text-muted-foreground">
                        <Link
                            href="https://github.com/yankes404/netflix-clone-nextjs"
                            target="_blank"
                            className="hover:underline"
                        >
                            Github Repository
                        </Link>
                    </div>
                </div>
            </footer>
        </>
    )
}