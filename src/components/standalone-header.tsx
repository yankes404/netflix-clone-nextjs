"use client";

import Link from "next/link";
import Image from "next/image";

export const StandaloneHeader = () => {
    return (
        <header className="flex items-center justify-center w-full py-8">
            <Link
                href="/"
            >
                <Image
                    src="/full_logo.svg"
                    alt="Netflix"
                    height={56}
                    width={124}
                    className="hidden sm:block"
                />
                <Image
                    src="/logo.svg"
                    alt="Netflix"
                    height={48}
                    width={48}
                    className="sm:hidden"
                />
            </Link>
        </header>
    )
}