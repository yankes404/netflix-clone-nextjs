"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useProfileId = () => {
    const router = useRouter();
    const [profileId, setProfileId] = useState("");

    const searchParams = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("profile-id") ?? localStorage.getItem("profile-id");

        if (!id) {
            router.push("/choose-profile");
        }

        setProfileId(id ?? "");
        if (id) {
            localStorage.setItem("profile-id", id);
        }
    }, []);

    return profileId;
}