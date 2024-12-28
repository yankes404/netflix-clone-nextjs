import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { CreateProfileForm } from "@/features/profiles/components/create-profile-form"

export const metadata: Metadata = {
    title: "Create Profile - Netflix"
}

const CreateProfilePage = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return (
        <div className="flex justify-center w-full mt-8">
            <CreateProfileForm />
        </div>
    )
}
 
export default CreateProfilePage;