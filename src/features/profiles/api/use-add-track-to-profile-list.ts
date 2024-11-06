"use client";

import { useMutation } from "@tanstack/react-query";
import { addTrackToProfileList } from "../actions";
import { toast } from "sonner";
import { queryClient } from "@/components/query-provider";

export const useAddTrackToProfileList = () => {
    const mutation = useMutation({
        mutationFn: (trackId: string) => addTrackToProfileList(trackId),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Track has been added to your list");
                queryClient.invalidateQueries({ queryKey: ["is-track-in-profile-list", data.trackId] })
            } else {
                toast.error(data?.error ?? "Something went wrong");
            }
        }
    });

    return mutation;
}