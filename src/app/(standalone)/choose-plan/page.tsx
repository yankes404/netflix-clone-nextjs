import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChoosePlanClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Choose Plan - Netflix"
}

const ChoosePlan = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChoosePlanClient />
}
 
export default ChoosePlan;