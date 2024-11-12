"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, LoaderCircleIcon, Tv2Icon } from "lucide-react";
import { CopyValueButton } from "@/components/copy-value-button";
import { useCheckVerificationToken } from "../api/use-check-verification-token";
import { useSession } from "next-auth/react";

export const EmailVerificationCard = () => {
    const { data: session } = useSession();
    
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const { data, isPending } = useCheckVerificationToken(token ?? "");

    return (
        <Card className="w-full lg:w-[450px]">
            <CardHeader>
                {token ? (
                    <div className="w-full flex flex-col gap-4">
                        <div className="text-sm font-mono font-semibold flex items-center gap-2 w-full justify-center">
                            <span className="shrink-0">Token:</span> <CopyValueButton value={token} />
                        </div>
                        {isPending ? (
                            <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground mx-auto" />
                        ): data?.success ? (
                                <div className="w-full flex flex-col items-center justify-center gap-2">
                                    <div className="text-sm font-medium text-emerald-500 flex items-center">
                                        <CheckCircleIcon className="size-4 mr-1" />
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
                            <div className="text-sm font-medium text-destructive flex items-center justify-center">
                                <ExclamationTriangleIcon className="size-4 mr-1" />
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