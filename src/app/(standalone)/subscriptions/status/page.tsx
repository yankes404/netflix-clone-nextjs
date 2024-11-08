import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionStatusClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Subscriptions - Netflix"
}

const SubscriptionStatusPage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <SubscriptionStatusClient />
}
 
export default SubscriptionStatusPage;