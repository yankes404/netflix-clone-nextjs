"use client";

import { useUserId } from "@/features/auth/api/use-user-id"
import { useGetProfiles } from "@/features/profiles/api/use-get-profiles"
import { getProfileImage } from "@/lib/utils"
import Image from "next/image"

import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";

export const ChooseProfileClient = () => {
    const userId = useUserId();
    const { data: profiles, isLoading } = useGetProfiles(userId);

    if (isLoading) {
        return (
            <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground mx-auto mt-8" />
        )
    }

    return (
        <div className="w-full flex justify-center mt-8 gap-6">
            {profiles?.map((profile) => (
                <Link
                    href={`/?profile-id=${profile.id}`}
                    key={profile.id}
                    className="group"
                >
                    <Image
                        src={getProfileImage(profile.image)}
                        width={64}
                        height={64}
                        alt={profile.name}
                        className="rounded-sm origin-bottom group-hover:scale-110 transition"
                    />
                    <p className="mt-3 text-lg font-semibold origin-top-left -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
                        {profile.name}
                    </p>
                </Link>
            ))}
        </div>
    )
}