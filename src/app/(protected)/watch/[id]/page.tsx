import { Metadata } from "next";
import { WatchIdClient } from "./client";

export const metadata: Metadata = {
    title: "Watch - Netflix"
}

const WatchIdPage = () => {
    return <WatchIdClient />
}
 
export default WatchIdPage;