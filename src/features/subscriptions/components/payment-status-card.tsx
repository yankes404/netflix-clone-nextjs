"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRetrieveSessionStatus } from "../api/use-retrieve-session-status";
import { CheckCircleIcon, LoaderCircleIcon, Tv2Icon } from "lucide-react";

export const PaymentStatusCard = () => {
    
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("id");
    const isError = !!searchParams.get("error");
    
    const { data: status, isPending } = useRetrieveSessionStatus(sessionId ?? "");

    const onCopyId = () => {
        if (!sessionId) return toast.error("No Session Id");

        try {
            navigator.clipboard.writeText(sessionId);
            toast.success("Copied");
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <Card className="w-full lg:w-[450px]">
            <CardHeader>
                {sessionId ? (
                    <div className="w-full flex flex-col gap-4">
                        <div className="text-sm font-mono font-semibold flex items-center gap- w-full1">
                            <span className="shrink-0">Session Id:</span> <button onClick={onCopyId} className="bg-neutral-800 hover:bg-neutral-700 transition text-neutral-300 p-1 rounded-sm text-xs truncate select-none">{sessionId}</button>
                        </div>
                        {isPending ? (
                            <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground mx-auto" />
                        ): status === "complete" ? (
                                <div className="w-full flex flex-col items-center gap-2">
                                    <div className="text-sm font-medium text-emerald-500 flex items-center">
                                        <CheckCircleIcon className="size-4 mr-1" />
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
                            <div className="text-sm font-medium text-destructive flex items-center">
                                <ExclamationTriangleIcon className="size-4 mr-1" />
                                <p>
                                    {status === "expired" && "Payment expired"}
                                    {status === "open" && "Payment is open, but not completed"}
                                    {!status && "Payment not found"}
                                </p>
                            </div>
                        )}
                    </div>
                ): isError ? (
                    <div className="text-sm font-medium text-destructive flex items-center">
                        <ExclamationTriangleIcon className="size-4 mr-1" />
                        <p>
                            Something went wrong. Don&apos;t worry, you won't be charged, this is only demo
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