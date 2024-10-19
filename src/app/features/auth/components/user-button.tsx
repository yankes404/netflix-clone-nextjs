"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { LogOutIcon, UserIcon, UsersIcon } from "lucide-react";

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

export const UserButton = () => {
    const router = useRouter();
    const { data: session } = useSession();

    console.log(session)

    if (!session || !session.user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none rounded-md">
                <Avatar className="size-8 rounded-md">
                    <AvatarImage
                        src={session.user.image ?? ""}
                        alt="User Profile"
                        className="rounded-md"
                    />
                    <AvatarFallback className="bg-red-500 rounded-md flex items-center justify-center text-sm font-semibold select-none">
                        {session.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end" sideOffset={10}>
                <DropdownMenuLabel className="space-y-1">
                    <p className="text-sm font-semibold">{session.user.name}</p>
                    <p className="text-xs font-medium text-muted-foreground">{session.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.push("/settings")}
                >
                    <div className="flex items-center gap-1.5">
                        <UserIcon className="size-4 mr-0" />
                        Account
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => router.push("/select-user")}
                >
                    <div className="flex items-center gap-1.5">
                        <UsersIcon className="size-4 mr-0" />
                        Switch User
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