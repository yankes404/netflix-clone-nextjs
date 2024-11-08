import { auth } from "@/auth";
import { SignInCard } from "@/features/auth/components/sign-in-card";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Sign in - Netflix"
}

const SignUpPage = async () => {
    const session = await auth();

    if (session && session.user) return redirect("/");

    return (
        <div className="w-full flex justify-center mt-8">
            <SignInCard />
        </div>
    )
}
 
export default SignUpPage;