"use client";

import { useQuery } from "@tanstack/react-query";

import { checkVerificationToken } from "../actions";

export const useCheckVerificationToken = (token: string) => {
    const query = useQuery({
        queryKey: ["verification-tokens", token],
        queryFn: async () => checkVerificationToken(token)
    });

    return query;
}