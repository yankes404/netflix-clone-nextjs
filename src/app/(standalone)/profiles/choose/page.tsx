import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { ChooseProfileClient } from "./client";

export const metadata: Metadata = {
    title: "Choose Profile - Netflix"
}

const ChooseProfilePage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChooseProfileClient />
}
 
export default ChooseProfilePage;