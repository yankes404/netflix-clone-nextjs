"use client";

import { useQuery } from "@tanstack/react-query";

import { retrieveSessionStatus } from "../actions";

export const useRetrieveSessionStatus = (id: string) => {
    const query = useQuery({
        queryKey: ["session-status", id],
        queryFn: async () => (await retrieveSessionStatus(id)).status
    });

    return query;
}