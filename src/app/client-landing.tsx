"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export const ClientLanding = () => {
    return (
        <div
            className="w-screen h-screen bg-cover"
            style={{
                backgroundImage: `url(/hero_cover.webp)`
            }}
        >
            <div
                className="w-full h-screen px-4 mx-auto max-w-screen-2xl"
            >
                <header className="flex items-center justify-between w-full py-8">
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
                            height={36}
                            width={36}
                            className="sm:hidden"
                        />
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="!bg-transparent opacity-75 hover:opacity-100"
                        >
                            <Link href="/sign-in">
                                Sign in
                            </Link>
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            asChild
                        >
                            <Link href="/sign-up">
                                Sign up
                            </Link>
                        </Button>
                    </div>
                </header>
                <div className="w-full lg:w-[450px] py-16 space-y-6">
                    <h1 className="text-3xl font-bold leading-10">
                        Thousands of movies and series in <span className="text-red-500">one subscription!</span>
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur impedit debitis minus consequatur eum mollitia. Eos aut labore quo exercitationem, tempora, placeat quod repudiandae veniam ipsum numquam nisi inventore. Unde.
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="lg"
                            asChild
                        >
                            <Link href="/sign-up">
                                Sign up
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            asChild
                            className="!bg-transparent opacity-75 hover:opacity-100"
                        >
                            <Link href="/sign-in">
                                Sign in
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}