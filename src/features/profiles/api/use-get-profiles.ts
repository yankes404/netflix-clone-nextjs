"use client";

import { useQuery } from "@tanstack/react-query"
import { getProfiles } from "../actions"

export const useGetProfiles = (userId: string) => {
    const query = useQuery({
        queryKey: ["profiles", userId],
        queryFn: () => getProfiles(userId)
    });

    return query;
}