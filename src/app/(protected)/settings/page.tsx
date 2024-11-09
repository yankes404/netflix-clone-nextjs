import { Metadata } from "next";

import { SettingsClient } from "./client";

export const metadata: Metadata = {
    title: "Settings - Netflix"
}

const SettingsPage = () => {
    return <SettingsClient />
}
 
export default SettingsPage;