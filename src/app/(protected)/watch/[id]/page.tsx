import { Metadata } from "next";
import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";

import { getTrackById } from "@/features/tracks/actions";
import { Button } from "@/components/ui/button";

import { WatchIdClient } from "./client";

export const revalidate = 60 * 10;

export const metadata: Metadata = {
    title: "Watch - Netflix",
};

interface Props {
    params: { id: string };
    searchParams: { episode_id?: string };
}

const WatchIdPage = async ({ params, searchParams }: Props) => {
    const trackId = params.id;
    const episodeId = searchParams.episode_id;

    const data = await getTrackById(trackId, episodeId);

    if (!data) {
        return (
            <div className="w-screen h-screen bg-background p-4 flex flex-col items-center justify-center gap-6">
                <AlertTriangleIcon className="size-6" />
                <p className="text-sm font-medium text-muted-foreground">Track not found</p>
                <Button variant="foreground" asChild>
                    <Link href="/">Go back to home</Link>
                </Button>
            </div>
        );
    }

    return <WatchIdClient data={data} />;
};

export default WatchIdPage;