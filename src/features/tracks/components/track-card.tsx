"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSeconds } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";

interface Props {
    id: string;
    title: string
    lenght: number;
    image: string;
    tags: string[]
}

export const TrackCard = ({
    id,
    title,
    lenght,
    image,
    tags
}: Props) => {
    const imageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    const onMouseOver = () => {
        if (imageRef.current && headerRef.current) {
            imageRef.current.style.zIndex = "50";
            headerRef.current.style.zIndex = "40";
        }
    }

    const onMouseLeave = () => {
        if (imageRef.current && headerRef.current) {
            imageRef.current.style.zIndex = "20";
            headerRef.current.style.zIndex = "10";
        }
    }

    return (
        <Link href={`/watch/${id}`} className="relative">
            <Card
                className="movie-card bg-neutral-900 group transition duration-300 flex flex-col items-end relative border-none"
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
            >
                <div className="w-full relative h-[176px] overflow-hidden rounded-md z-20" ref={imageRef}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="rounded-md object-cover transition group-hover:scale-110 duration-300"
                    />
                    <Badge className="absolute bottom-0 right-0 m-4 bg-black/75 text-neutral-200 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                        {formatSeconds(lenght)}
                    </Badge>
                </div>
                <CardHeader ref={headerRef} className="w-full bg-neutral-900 rounded-b-md border border-t-transparent transiton duration-300 p-4 bottom-0 opacity-0 group-hover:translate-y-full group-hover:opacity-100 absolute z-10 blur-sm group-hover:blur-none">
                    <CardTitle className="text-sm">{title}</CardTitle>
                    <CardDescription className="flex items-center gap-x-1.5 font-medium text-xs">
                        {tags.map((tag, key) => (
                            <Fragment key={key}>
                                <span>{tag}</span>
                                {key !== (tags.length - 1) && (
                                    <span className="size-1 rounded-md bg-muted-foreground" />
                                )}
                            </Fragment>
                        ))}
                    </CardDescription>
                </CardHeader>
            </Card>
        </Link>
    )
}