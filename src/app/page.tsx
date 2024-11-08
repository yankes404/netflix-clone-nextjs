import { auth } from "@/auth";
import { Client } from "./client";
import { ClientLanding } from "./client-landing";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home - Netflix"
}

const HomePage = async () => {
    const isAuthorized = !!(await auth());

    if (isAuthorized) return <Client />
    else return <ClientLanding />
}
 
export default HomePage;