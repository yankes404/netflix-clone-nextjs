import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionStatusClient } from "./client";

const SubscriptionStatusPage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <SubscriptionStatusClient />
}
 
export default SubscriptionStatusPage;