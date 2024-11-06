"use client";

import { useMutation } from "@tanstack/react-query";
import { removeTrackFromProfileList } from "../actions";
import { toast } from "sonner";
import { queryClient } from "@/components/query-provider";

export const useRemoveTrackFromProfileList = () => {
    const mutation = useMutation({
        mutationFn: (id: string) => removeTrackFromProfileList({ trackId: id }),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Track has been removed from your list");
                queryClient.removeQueries({ queryKey: ["is-track-in-profile-list", data.trackId] })
            } else {
                toast.error(data?.error ?? "Something went wrong");
            }
        }
    });

    return mutation;
}