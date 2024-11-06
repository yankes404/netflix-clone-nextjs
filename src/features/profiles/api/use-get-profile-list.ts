"use client";

import { useQuery } from "@tanstack/react-query";
import { useProfileId } from "./use-profile-id";

import { getProfileList } from "../actions";

export const useGetProfileList = () => {
    const profileId = useProfileId();

    const query = useQuery({
        queryKey: ["profile-list", profileId],
        queryFn: () => getProfileList()
    });

    return query;
}