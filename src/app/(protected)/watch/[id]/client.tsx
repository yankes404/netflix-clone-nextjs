"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

import { TrackPlayer } from "@/features/tracks/components/track-player";
import { TrackDetails } from "@/features/tracks/types";

interface Props {
    data: TrackDetails;
}

export const WatchIdClient = ({ data }: Props) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    
    const isVideoFetched = useRef(false);

    useEffect(() => {
        const path = data.track.path || data.currentEpisode?.path;

        if (!path) {
            toast.error("Coś poszło nie tak");
            router.push("/");
            return;
        }

        if (!isVideoFetched.current) {
            isVideoFetched.current = true;

            startTransition(() => {
                fetch(path)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.arrayBuffer();
                    })
                    .then((buffer) => {
                        const videoBlob = new Blob([buffer], { type: 'video/mp4' });
                        const videoUrl = URL.createObjectURL(videoBlob);

                        setVideoSrc(videoUrl);
                    })
                    .catch((error) => {
                        console.error(error);
                        toast.error("Coś poszło nie tak");
                        router.push("/");
                    });
            });
        }
    }, [data, router]);

    return (
        <>
            {(isPending || !videoSrc) ? (
                <div className="w-screen h-screen grid place-items-center">
                    <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <TrackPlayer
                    type={data.track.type}
                    data={data}
                    seasons={data.seasons}
                    nextEpisode={data.nextEpisode}
                    videoSrc={videoSrc}
                    time={data.time}
                />
            )}
        </>
    );
};