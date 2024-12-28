"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfileList } from "../actions";
import { useProfileId } from "./use-profile-id";

export const useGetProfileList = () => {
    const profileId = useProfileId();

    const query = useQuery({
        queryKey: ["profile-list", profileId],
        queryFn: () => getProfileList()
    });

    return query;
}