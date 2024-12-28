"use client";

import { LoaderCircle } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { useGetProfileList } from "@/features/profiles/api/use-get-profile-list";
import { TrackCard } from "@/features/tracks/components/track-card";

export const MyListClient = () => {
    const { data, isPending } = useGetProfileList();

    if (isPending) {
        return (
            <div className="w-full flex items-center justify-center flex-col gap-2">
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
                <p className="text-sm font-medium text-muted-foreground">Please wait, loading...</p>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-y-4">
            <h1 className="text-xl font-semibold">Your list</h1>
            {(data?.list && data.list.length) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {data.list.map((listItem) => (
                        <TrackCard
                            key={listItem.id}
                            id={listItem.track.id}
                            title={listItem.track.title}
                            image={listItem.track.poster}
                            tags={[]}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 text-destructive">
                    <ExclamationTriangleIcon className="size-4" />
                    <p className="font-medium text-sm">{data!.error ? data?.error : !data?.list?.length ? "Oops, looks like you didn't add anything to your list. Add something and come back here later!" : "Something went wrong"}</p>
                </div>
            )}
        </div>
    )
}