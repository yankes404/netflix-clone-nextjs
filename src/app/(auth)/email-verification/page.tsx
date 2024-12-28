import { Metadata } from "next";
import { Suspense } from "react";

import { EmailVerificationCard } from "@/features/auth/components/email-verification-card";

export const metadata: Metadata = {
    title: "Email Verification - Netflix"
}

const EmailVerificationPage = () => {
    return (
        <Suspense>
            <div className="flex justify-center w-full mt-8">
                <EmailVerificationCard />
            </div>
        </Suspense>
    )
}
 
export default EmailVerificationPage;