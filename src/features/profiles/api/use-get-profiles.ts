"use client";

import { useQuery } from "@tanstack/react-query";

import { getProfiles } from "../actions";

export const useGetProfiles = () => {
    const query = useQuery({
        queryKey: ["profiles"],
        queryFn: () => getProfiles()
    });

    return query;
}