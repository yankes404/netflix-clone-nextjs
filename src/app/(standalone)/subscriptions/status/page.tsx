import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { SubscriptionStatusClient } from "./client";

export const metadata: Metadata = {
    title: "Subscriptions - Netflix"
}

const SubscriptionStatusPage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <SubscriptionStatusClient />
}
 
export default SubscriptionStatusPage;