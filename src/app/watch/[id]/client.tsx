"use client";

import { VideoPlayer } from "@/features/videos/components/video-player";
import { LoaderCircleIcon } from "lucide-react";

export const WatchIdClient = () => {
    const isLoading = true;
    
    if (isLoading) {
        return (
            <div className="w-screen h-screen bg-background p-4 flex flex-col items-center justify-center gap-6">
                <LoaderCircleIcon className="size-6 animate-spin" />
                <p className="text-sm font-medium text-muted-foreground">
                    Loading video...
                </p>
            </div>
        )
    }

    return <VideoPlayer />
}