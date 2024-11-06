"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TrackCard } from "@/features/tracks/components/track-card";
import Link from "next/link";

export const Client = () => {
    return (
        <>
            <Header />
            <Hero />
            <div className="w-screen max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-16 px-4">
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
                <TrackCard
                    id="faf9"
                    title="Fast and Furious 9"
                    image={"/api/cdn/images/faf9bg.webp"}
                    tags={["Action", "Drama"]}
                />
            </div>
            <Footer />
        </>
    )
}