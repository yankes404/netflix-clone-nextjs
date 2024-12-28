"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { UserButton } from "@/features/auth/components/user-button";

import { Button } from "./ui/button";

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

    const [top, setTop] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            setTop(window.scrollY);
        }

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={cn("w-screen mx-auto fixed top-0 z-50 left-0 transition-colors duration-300", top > 0 && "bg-background")}>
            <div className="w-full max-w-screen-2xl mx-auto py-6 px-4 flex justify-between items-center gap-x-6">
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
                    <Button
                        variant="ghost"
                        asChild
                        size="icon"
                        className="!bg-transparent p-0"
                    >
                        <Link href="/search">
                            <SearchIcon className="size-5" />
                        </Link>
                    </Button>
                    <UserButton />
                </div>
            </div>
        </header>
    )
}