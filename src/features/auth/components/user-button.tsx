"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { HeartIcon, LogOutIcon, SettingsIcon, UsersIcon } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Avatar,
    AvatarImage,
    AvatarFallback
} from "@/components/ui/avatar";
import { useProfile } from "@/features/profiles/api/use-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProfileImage } from "@/lib/utils";

export const UserButton = () => {
    const router = useRouter();

    const { data: profile, isLoading } = useProfile();

    if (isLoading) {
        return (
            <Skeleton className="rounded-sm size-8" />
        )
    }

    if (!profile) {
        return (
            <Button
                size="sm"
                asChild
            >
                <Link
                    href="/profiles/choose"
                >
                    Choose Profile
                </Link>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-sm outline-none drop-shadow-lg">
                <Avatar className="rounded-sm size-8">
                    <AvatarImage
                        src={getProfileImage(profile.image)}
                        alt="User Profile"
                        className="rounded-sm"
                    />
                    <AvatarFallback className="flex items-center justify-center text-sm font-semibold bg-red-500 rounded-sm select-none">
                        {profile.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" sideOffset={10}>
                <DropdownMenuLabel className="space-y-1">
                    <p className="text-sm font-semibold">{profile.name}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                >
                    <div className="flex items-center gap-1.5">
                        <SettingsIcon className="mr-0 size-4" />
                        Settings
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/profiles/choose")}
                >
                    <div className="flex items-center gap-1.5">
                        <UsersIcon className="mr-0 size-4" />
                        Switch Profile
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/my-list")}
                >
                    <div className="flex items-center gap-1.5">
                        <HeartIcon className="mr-0 size-4" />
                        Your list
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut()}
                >
                    <div className="flex items-center gap-1.5">
                        <LogOutIcon className="mr-0 size-4" />
                        Logout
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}