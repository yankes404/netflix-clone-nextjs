import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CreateProfileClient } from "./client";

const CreateProfilePage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <CreateProfileClient />
}
 
export default CreateProfilePage;