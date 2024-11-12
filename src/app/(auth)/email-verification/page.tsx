import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { EmailVerificationClient } from "./client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Email Verification - Netflix"
}

const EmailVerificationPage = async () => {
    return <EmailVerificationClient />
}
 
export default EmailVerificationPage;