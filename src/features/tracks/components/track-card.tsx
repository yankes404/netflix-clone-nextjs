"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfilesListButton } from "@/features/profiles/components/profiles-list-button";
import { formatSeconds } from "@/lib/utils";
import { PlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useRef } from "react";

interface Props {
    id: string;
    title: string
    image: string;
    tags: string[]
}

export const TrackCard = ({
    id,
    title,
    image,
    tags
}: Props) => {
    return (
        <Card className="group">
            <div className="relative w-full aspect-video">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="w-full object-cover rounded-t-lg"
                />
            </div>
            <CardHeader className="relative">
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {tags.toLocaleString("en-US").replaceAll(",", ", ")}
                </CardDescription>
                <div className="flex gap-x-2 absolute bottom-6 right-6 opacity-0 scale-0 transition-opacity group-hover:opacity-100 group-hover:scale-100 duration-300">
                    <Button
                        size="icon"
                        className="rounded-full !size-7"
                        asChild
                    >
                        <Link href={`/watch/${id}`}>
                            <PlayIcon className="!size-3" />   
                        </Link>
                    </Button>
                    <ProfilesListButton trackId={id} />
                </div>
            </CardHeader>
        </Card>
    )
}