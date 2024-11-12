"use client";

import { EmailVerificationCard } from "@/features/auth/components/email-verification-card";

export const EmailVerificationClient = () => {
    return (
        <div className="flex justify-center mt-8">
            <EmailVerificationCard />
        </div>
    )
}