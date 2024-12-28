"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircleIcon, LoaderCircleIcon, Tv2Icon } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyValueButton } from "@/components/copy-value-button";

import { useCheckVerificationToken } from "../api/use-check-verification-token";

export const EmailVerificationCard = () => {
    const { data: session } = useSession();
    
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const { data, isPending } = useCheckVerificationToken(token ?? "");

    return (
        <Card className="w-full lg:w-[450px]">
            <CardHeader>
                {token ? (
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex items-center justify-center w-full gap-2 font-mono text-sm font-semibold">
                            <span className="shrink-0">Token:</span> <CopyValueButton value={token} />
                        </div>
                        {isPending ? (
                            <LoaderCircleIcon className="mx-auto size-4 animate-spin text-muted-foreground" />
                        ): data?.success ? (
                                <div className="flex flex-col items-center justify-center w-full gap-2">
                                    <div className="flex items-center text-sm font-medium text-emerald-500">
                                        <CheckCircleIcon className="mr-1 size-4" />
                                        <p>
                                            Email verified
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        asChild
                                        variant={"primary"}
                                    >
                                        {session?.user ? (
                                            <Link href="/">
                                                <Tv2Icon />
                                                Start watching!
                                            </Link>
                                        ): (
                                            <Link href="/sign-in">
                                                Sign in
                                            </Link>
                                        )}
                                    </Button>
                                </div>
                        ): (
                            <div className="flex items-center justify-center text-sm font-medium text-destructive">
                                <ExclamationTriangleIcon className="mr-1 size-4" />
                                <p>
                                    {data?.error ?? "Something went wrong"}
                                </p>
                            </div>
                        )}
                    </div>
                ): (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-lg font-semibold">No token</p>
                        <Button
                            size="sm"
                            asChild
                        >
                            <Link href="/">
                                Go to home
                            </Link>
                        </Button>
                    </div>
                )}
            </CardHeader>
        </Card>
    )
}