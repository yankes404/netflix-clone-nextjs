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
            <Skeleton className="size-8 rounded-sm" />
        )
    }

    if (!profile) {
        return (
            <Button
                size="sm"
                asChild
            >
                <Link
                    href="/choose-profile"
                >
                    Choose Profile
                </Link>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none rounded-sm drop-shadow-lg">
                <Avatar className="size-8 rounded-sm">
                    <AvatarImage
                        src={getProfileImage(profile.image)}
                        alt="User Profile"
                        className="rounded-sm"
                    />
                    <AvatarFallback className="bg-red-500 rounded-sm flex items-center justify-center text-sm font-semibold select-none">
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
                        <SettingsIcon className="size-4 mr-0" />
                        Settings
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/choose-profile")}
                >
                    <div className="flex items-center gap-1.5">
                        <UsersIcon className="size-4 mr-0" />
                        Switch Profile
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/my-list")}
                >
                    <div className="flex items-center gap-1.5">
                        <HeartIcon className="size-4 mr-0" />
                        Your list
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut()}
                >
                    <div className="flex items-center gap-1.5">
                        <LogOutIcon className="size-4 mr-0" />
                        Logout
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}