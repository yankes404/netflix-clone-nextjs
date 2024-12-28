"use client";

import Link from "next/link";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";

import { useGetRandomTrack } from "@/features/tracks/api/use-get-random-track";

import { Button } from "./ui/button";

export const Hero = () => {
    const { data, isLoading } = useGetRandomTrack();
    
    return (
        <div
            className="w-screen h-[90vh] overflow-hidden bg-cover bg-no-repeat bg-center px-4 relative bg-neutral-900"
            style={{
                backgroundImage: `url(${data?.poster})`
            }}
        >
            <div className="relative z-10 flex flex-col justify-end w-full h-full pb-24 mx-auto max-w-screen-2xl">
                {data && (
                    <>
                        <img
                            src={data.logo}
                            alt={data.title}
                            width={514}
                            height={126}
                            className="object-cover hero-logo"
                        />
                        <div className="flex gap-3 mt-14">
                            <Button
                                size="lg"
                                asChild
                            >
                                <Link
                                    href={`/watch/${data.id}`}
                                >
                                    <PlayIcon />
                                    Play
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
                {isLoading && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                        <LoaderCircleIcon className="size-4 animate-spin" />
                        <p>Please wait, loading...</p>
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-background" />
        </div>
    )
}