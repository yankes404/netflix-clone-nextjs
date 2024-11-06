"use client";

import { useQuery } from "@tanstack/react-query";

import { checkIsTrackInProfile } from "../actions";

export const useCheckIsTrackInProfile = (trackId: string) => {
    const query = useQuery({
        queryKey: ["is-track-in-profile-list", trackId],
        queryFn: () => checkIsTrackInProfile(trackId)
    });

    return query;
}