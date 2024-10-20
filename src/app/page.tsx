import { auth } from "@/auth";
import { Client } from "./client";
import { ClientLanding } from "./client-landing";

const HomePage = async () => {
    const isAuthorized = !!(await auth());

    if (isAuthorized) return <Client />
    else return <ClientLanding />
}
 
export default HomePage;