import { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SettingsClient } from "./client";

export const metadata: Metadata = {
    title: "Settings - Netflix"
}

const SettingsPage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return (
        <Suspense>
            <SettingsClient
                user={session.user}
            />
        </Suspense>
    )
}
 
export default SettingsPage;