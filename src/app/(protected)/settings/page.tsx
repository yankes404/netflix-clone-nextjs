import { Metadata } from "next";
import { Suspense } from "react";

import { SettingsClient } from "./client";

export const metadata: Metadata = {
    title: "Settings - Netflix"
}

const SettingsPage = () => {
    return (
        <Suspense>
            <SettingsClient />
        </Suspense>
    )
}
 
export default SettingsPage;