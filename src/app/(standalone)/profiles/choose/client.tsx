"use client";

import { useGetProfiles } from "@/features/profiles/api/use-get-profiles"
import { getProfileImage } from "@/lib/utils"
import Image from "next/image"

import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { useChooseProfile } from "@/features/profiles/api/use-choose-profile";
import Link from "next/link";

export const ChooseProfileClient = () => {
    const { data: profiles, isLoading } = useGetProfiles();

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
            <div className="w-full flex justify-center mt-4 gap-6 items-center">
                {Array.isArray(profiles) && profiles?.map((profile) => (
                    <button
                        key={profile.id}
                        onClick={() => chooseProfile(profile.id)}
                        className="p-4 rounded-md hover:bg-neutral-900 transition disabled:pointer-events-none disabled:opacity-50 relative"
                        disabled={isChoosingProfile}
                    >
                        <Image
                            src={getProfileImage(profile.image)}
                            alt={profile.name}
                            width={64}
                            height={64}
                            className="rounded-md"
                        />
                        <p className="text-sm font-semibold mt-2 text-start">
                            {profile.name}
                        </p>
                    </button>
                ))}
                <Link
                    href="/profiles/create"
                    className="size-16 rounded-md border border-neutral-700 bg-neutral-800/75 hover:bg-neutral-800 transition grid place-items-center disabled:pointer-events-none disabled:opacity-50"
                >
                    <PlusIcon className="size-6" />
                </Link>
            </div>
        </div>
    )
}