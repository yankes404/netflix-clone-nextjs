import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChooseProfileClient } from "./client";

const ChooseProfilePage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChooseProfileClient />
}
 
export default ChooseProfilePage;