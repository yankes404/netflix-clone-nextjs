import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { ChoosePlanClient } from "./client";

export const metadata: Metadata = {
    title: "Choose Plan - Netflix"
}

const ChoosePlan = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChoosePlanClient />
}
 
export default ChoosePlan;