"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getProfile } from "../actions";
import { useProfileId } from "./use-profile-id";

export const useProfile = (
    profileId?: string
) => {
    const [id, setId] = useState("");
    const pid = useProfileId();

    useEffect(() => {
        setId(profileId ?? pid);
    }, [profileId, pid]);

    const query = useQuery({
        queryKey: ["profiles", id],
        queryFn: () => getProfile(id),
    });

    return query;
}