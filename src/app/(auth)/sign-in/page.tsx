import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInCard } from "@/features/auth/components/sign-in-card";

export const metadata: Metadata = {
    title: "Sign in - Netflix"
}

const SignUpPage = async () => {
    const session = await auth();

    if (session && session.user) return redirect("/");

    return (
        <div className="flex justify-center w-full mt-8">
            <SignInCard />
        </div>
    )
}
 
export default SignUpPage;