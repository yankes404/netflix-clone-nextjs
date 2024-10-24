"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { UserButton } from "@/features/auth/components/user-button";
import { SearchIcon } from "lucide-react";

const links = [
    {
        href: "/",
        label: "Home"
    },
    {
        href: "/series",
        label: "Series"
    },
    {
        href: "/movies",
        label: "Movies"
    },
    {
        href: "/my-list",
        label: "My list"
    }
]

export const Header = () => {
    const pathname = usePathname();

    return (
        <header className="max-w-screen-2xl mx-auto py-6 px-4 w-full flex justify-between items-center gap-x-6 fixed top-0 z-10 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-10">
                <Link
                    href="/"
                >
                    <Image
                        src="/full_logo.svg"
                        alt="Netflix"
                        height={36}
                        width={96}
                        className="hidden sm:block"
                    />
                    <Image
                        src="/logo.svg"
                        alt="Netflix"
                        height={32}
                        width={32}
                        className="sm:hidden"
                    />
                </Link>
                <nav className="hidden sm:flex items-center gap-x-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(pathname === link.href && "pointer-events-none")}
                        >
                            <span className={cn("text-sm font-semibold drop-shadow-lg text-white/90 hover:opacity-75 transition", pathname === link.href && "pointer-events-none text-white")}>
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex items-center gap-x-6">
                <SearchIcon className="size-5" />
                <UserButton />
            </div>
        </header>
    )
}