"use client";

import Link from "next/link";
import Image from "next/image"
import { LoaderCircleIcon, PlusIcon } from "lucide-react";

import { getProfileImage } from "@/lib/utils"
import { useGetProfiles } from "@/features/profiles/api/use-get-profiles"
import { useChooseProfile } from "@/features/profiles/api/use-choose-profile";

export const ChooseProfileClient = () => {
    const { data: profiles, isLoading } = useGetProfiles();

    const {
        mutate: chooseProfile,
        isPending: isChoosingProfile
    } = useChooseProfile();

    if (isLoading) {
        return (
            <LoaderCircleIcon className="mx-auto mt-8 size-4 animate-spin text-muted-foreground" />
        )
    }

    return (
        <div className="flex flex-col items-center w-full mt-4">
            <h1 className="text-xl font-semibold">
                Choose Profile
            </h1>
            <div className="flex items-center justify-center w-full gap-6 mt-4">
                {Array.isArray(profiles) && profiles?.map((profile) => (
                    <button
                        key={profile.id}
                        onClick={() => chooseProfile(profile.id)}
                        className="relative p-4 transition rounded-md hover:bg-neutral-900 disabled:pointer-events-none disabled:opacity-50"
                        disabled={isChoosingProfile}
                    >
                        <Image
                            src={getProfileImage(profile.image)}
                            alt={profile.name}
                            width={64}
                            height={64}
                            className="rounded-md"
                        />
                        <p className="mt-2 text-sm font-semibold text-start">
                            {profile.name}
                        </p>
                    </button>
                ))}
                <Link
                    href="/profiles/create"
                    className="grid transition border rounded-md size-16 border-neutral-700 bg-neutral-800/75 hover:bg-neutral-800 place-items-center disabled:pointer-events-none disabled:opacity-50"
                >
                    <PlusIcon className="size-6" />
                </Link>
            </div>
        </div>
    )
}