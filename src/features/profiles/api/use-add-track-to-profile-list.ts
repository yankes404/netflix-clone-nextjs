"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/components/query-provider";

import { addTrackToProfileList } from "../actions";
import { useProfileId } from "./use-profile-id";

export const useAddTrackToProfileList = () => {
    const profileId = useProfileId();

    const mutation = useMutation({
        mutationFn: (trackId: string) => addTrackToProfileList(trackId),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Track has been added to your list");
                queryClient.invalidateQueries({ queryKey: ["is-track-in-profile-list", data.trackId] })
                queryClient.invalidateQueries({ queryKey: ["profile-list", profileId] })
            } else {
                toast.error(data?.error ?? "Something went wrong");
            }
        }
    });

    return mutation;
}