"use client";

import { useMutation } from "@tanstack/react-query";
import { saveWatchTime } from "../actions";

interface MutationProps {
    trackId: string;
    episodeId?: string;
}

export const useSaveWatchTime = (data: MutationProps) => {
    const mutation = useMutation({
        mutationFn: (time: number) => saveWatchTime({ ...data, time }),
    });

    return mutation;
}