"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getCookieValue(cookieName: string): string | null {
    const match = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
    return match ? decodeURIComponent(match[2]) : null;
}

export const useProfileId = () => {
    const router = useRouter();

    useEffect(() => {
        const cookieValue = getCookieValue("ync-profile-id");
        if (cookieValue) {
            setProfileId(cookieValue);
        } else {
            router.push("/profiles/choose");
        }
    }, [router]);

    const [profileId, setProfileId] = useState("");

    return profileId;
}