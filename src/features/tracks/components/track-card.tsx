"use client";

import Link from "next/link";
import { PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ProfilesListButton } from "@/features/profiles/components/profiles-list-button";

interface Props {
    id: string;
    title: string
    image: string;
    tags: string[];
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
                <img
                    src={image}
                    alt={title}
                    className="object-cover w-full rounded-t-lg"
                />
            </div>
            <CardHeader className="relative">
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {tags.toLocaleString("en-US").replaceAll(",", ", ")}
                </CardDescription>
                <div className="absolute flex transition-opacity duration-300 scale-0 opacity-0 gap-x-2 bottom-6 right-6 group-hover:opacity-100 group-hover:scale-100">
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