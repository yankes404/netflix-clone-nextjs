import { redirect } from "next/navigation";
import { Metadata } from "next";

import { auth } from "@/auth";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

export const metadata: Metadata = {
    title: "Sign up - Netflix"
}

const SignUpPage = async () => {
    const session = await auth();

    if (session && session.user) return redirect("/");

    return (
        <div className="w-full flex justify-center mt-8">
            <SignUpCard />
        </div>
    )
}
 
export default SignUpPage;