"use client";

import { useUserId } from "@/features/auth/api/use-user-id"
import { useGetProfiles } from "@/features/profiles/api/use-get-profiles"
import { getProfileImage } from "@/lib/utils"
import Image from "next/image"

import { LoaderCircleIcon } from "lucide-react";
import { useChooseProfile } from "@/features/profiles/api/use-choose-profile";

export const ChooseProfileClient = () => {
    const userId = useUserId();
    const { data: profiles, isLoading } = useGetProfiles(userId);

    const {
        mutate: chooseProfile,
        isPending: isChoosingProfile
    } = useChooseProfile();

    if (isLoading) {
        return (
            <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground mx-auto mt-8" />
        )
    }

    return (
        <div className="w-full flex flex-col items-center mt-4">
            <h1 className="font-semibold text-xl">
                Choose Profile
            </h1>
            <div className="w-full flex justify-center mt-4 gap-6">
                {profiles?.map((profile) => (
                    <button
                        onClick={() => chooseProfile(profile.id)}
                        key={profile.id}
                        className="group disabled:pointer-events-none disabled:opacity-50"
                        disabled={isChoosingProfile}
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
                    </button>
                ))}
            </div>
        </div>
    )
}