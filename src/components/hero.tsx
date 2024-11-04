"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { PlayIcon } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
    return (
        <div
            className="w-screen h-[90vh] overflow-hidden bg-cover bg-no-repeat bg-center px-4 relative"
            style={{
                backgroundImage: `url(/api/cdn/images/bbbg.webp)`
            }}
        >
            <div className="max-w-screen-2xl mx-auto w-full h-full pb-24 flex flex-col justify-end relative z-10">
                <Image
                    src="/api/cdn/images/bbl.webp"
                    alt="Breaking Bad"
                    width={514}
                    height={126}
                    className="hero-logo"
                />
                <div className="mt-14 flex gap-3">
                    <Button
                        size="lg"
                        asChild
                    >
                        <Link href="/watch/bb">
                            <PlayIcon />
                            Play
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="w-full h-1/5 absolute bottom-0 left-0 bg-gradient-to-t from-background" />
        </div>
    )
}