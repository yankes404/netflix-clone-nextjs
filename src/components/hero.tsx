"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { PlayIcon } from "lucide-react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export const Hero = () => {
    return (
        <div
            className="w-screen h-[90vh] overflow-hidden bg-cover bg-no-repeat bg-center px-4 relative"
            style={{
                backgroundImage: `url(https://images-1.rakuten.tv/storage/snapshot/shot/d00942ee-6bad-4ae9-abbe-c4dcd54e3052-fast-furious-9-1626770108.jpeg)`
            }}
        >
            <div className="max-w-screen-2xl mx-auto w-full h-full pb-24 flex flex-col justify-end relative z-10">
                <Image
                    src="/series-and-movies/logos/FastAndFurious9.webp"
                    alt="Fast and Furious 9"
                    width={324}
                    height={96}
                    className="hero-logo"
                />
                <div className="mt-8 flex gap-3">
                    <Button
                        size="lg"
                    >
                        <PlayIcon />
                        Play
                    </Button>
                    <Button
                        size="lg"
                        variant="secondary"
                    >
                        <InfoCircledIcon />
                        More Info
                    </Button>
                </div>
            </div>
            <div className="w-full h-1/5 absolute bottom-0 left-0 bg-gradient-to-t from-background" />
        </div>
    )
}