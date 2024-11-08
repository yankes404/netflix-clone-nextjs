"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { LoaderCircleIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { useGetRandomTrack } from "@/features/tracks/api/use-get-random-track";

export const Hero = () => {
    const { data, isLoading } = useGetRandomTrack();
    
    return (
        <div
            className="w-screen h-[90vh] overflow-hidden bg-cover bg-no-repeat bg-center px-4 relative bg-neutral-900"
            style={{
                backgroundImage: `url(${data?.poster})`
            }}
        >
            <div className="max-w-screen-2xl mx-auto w-full h-full pb-24 flex flex-col justify-end relative z-10">
                {data && (
                    <>
                        <Image
                            src={data.logo}
                            alt={data.title}
                            width={514}
                            height={126}
                            className="hero-logo object-cover"
                        />
                        <div className="mt-14 flex gap-3">
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
            <div className="w-full h-1/5 absolute bottom-0 left-0 bg-gradient-to-t from-background" />
        </div>
    )
}