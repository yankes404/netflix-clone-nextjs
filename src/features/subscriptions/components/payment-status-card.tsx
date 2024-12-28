"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon, LoaderCircleIcon, Tv2Icon } from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CopyValueButton } from "@/components/copy-value-button";

import { useRetrieveSessionStatus } from "../api/use-retrieve-session-status";

export const PaymentStatusCard = () => {
    
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("id");
    const isError = !!searchParams.get("error");
    
    const { data: status, isPending } = useRetrieveSessionStatus(sessionId ?? "");

    return (
        <Card className="w-full lg:w-[450px]">
            <CardHeader>
                {sessionId ? (
                    <div className="flex flex-col w-full gap-4">
                        <div className="flex items-center justify-center w-full gap-2 font-mono text-sm font-semibold">
                            <span className="shrink-0">Session Id:</span> <CopyValueButton value={sessionId} />
                        </div>
                        {isPending ? (
                            <LoaderCircleIcon className="mx-auto size-4 animate-spin text-muted-foreground" />
                        ): status === "complete" ? (
                                <div className="flex flex-col items-center w-full gap-2">
                                    <div className="flex items-center text-sm font-medium text-emerald-500">
                                        <CheckCircleIcon className="mr-1 size-4" />
                                        <p>
                                            Transaction completed successfully
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        asChild
                                        variant={"primary"}
                                    >
                                        <Link href="/">
                                        <Tv2Icon />
                                            Start watching!
                                        </Link>
                                    </Button>
                                </div>
                        ): (
                            <div className="flex items-center text-sm font-medium text-destructive">
                                <ExclamationTriangleIcon className="mr-1 size-4" />
                                <p>
                                    {status === "expired" && "Payment expired"}
                                    {status === "open" && "Payment is open, but not completed"}
                                    {!status && "Payment not found"}
                                </p>
                            </div>
                        )}
                    </div>
                ): isError ? (
                    <div className="flex items-center text-sm font-medium text-destructive">
                        <ExclamationTriangleIcon className="mr-1 size-4" />
                        <p>
                            Something went wrong. Don&apos;t worry, you won&apos;t be charged, this is only demo
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-lg font-semibold">No Session Id</p>
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