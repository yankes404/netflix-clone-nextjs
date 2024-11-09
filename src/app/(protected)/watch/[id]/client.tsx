"use client";

import { Button } from "@/components/ui/button";
import { useGetTrack } from "@/features/tracks/api/use-get-track";
import { TrackPlayer } from "@/features/tracks/components/track-player";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export const WatchIdClient = () => {
    const { id: trackId } = useParams<{ id: string }>();
    const searchParams = useSearchParams();
    const episodeId = searchParams.get("episode_id") ?? undefined;
    const { data, isLoading } = useGetTrack(trackId, episodeId);

    const [videoSrc, setVideoSrc] = useState("");
    const [isLoadingVideoSrc, startTransition] = useTransition();
    const [videoSrcError, setVideoSrcError] = useState(false);

    useEffect(() => {
        if (data) {
            const path = data?.currentEpisode?.path ?? data?.track.path ?? "";
    
            startTransition(async() => {
                const response = await fetch(path);
                if (!response.ok) {
                    return setVideoSrcError(true);
                }
                const arrayBuffer = await response.arrayBuffer();
                
                const videoBlob = new Blob([arrayBuffer], { type: 'video/mp4' });
    
                const videoUrl = URL.createObjectURL(videoBlob);
    
                setVideoSrc(videoUrl);
            })
        }
    }, [data]);

    if (isLoading && isLoadingVideoSrc) {
        return (
            <div className="w-screen h-screen bg-background p-4 flex flex-col items-center justify-center gap-6">
                <LoaderCircleIcon className="size-6 animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">
                    Loading video...
                </p>
            </div>
        )
    }

    if (!data || videoSrcError) {
        return (
            <div className="w-screen h-screen bg-background p-4 flex flex-col items-center justify-center gap-6">
                <ExclamationTriangleIcon className="size-6" />
                <p className="text-sm font-medium text-muted-foreground">
                    Track not found
                </p>
                <Button
                    variant="foreground"
                    asChild
                >
                    <Link href="/">
                        Go back to home
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <TrackPlayer
            type={data.track.type}
            data={data}
            seasons={data.seasons}
            nextEpisode={data.nextEpisode}
            videoSrc={videoSrc}
            time={data.time}
        />
    )
}