import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChooseProfileClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Choose Profile - Netflix"
}

const ChooseProfilePage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChooseProfileClient />
}
 
export default ChooseProfilePage;