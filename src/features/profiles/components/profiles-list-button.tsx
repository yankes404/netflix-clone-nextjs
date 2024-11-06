"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useCheckIsTrackInProfile } from "../api/use-check-is-track-in-profile";
import { useAddTrackToProfileList } from "../api/use-add-track-to-profile-list";
import { useRemoveTrackFromProfileList } from "../api/use-remove-track-from-profile-list";
import { useMemo } from "react";

interface Props {
    trackId: string;
}

export const ProfilesListButton = ({ trackId }: Props) => {
    const { data, isLoading } = useCheckIsTrackInProfile(trackId);

    const { mutate: addTrackToProfileList, isPending: isAddingTrackToProfileList } = useAddTrackToProfileList();
    const { mutate: removeTrackToProfileList, isPending: isRemovingTrackToProfileList } = useRemoveTrackFromProfileList();

    const isPending = useMemo(() => isAddingTrackToProfileList || isRemovingTrackToProfileList, [isAddingTrackToProfileList, isRemovingTrackToProfileList]);

    const toogle = () => {
        const value = !data?.isTrackIn;

        if (value) {
            addTrackToProfileList(trackId);
        } else {
            removeTrackToProfileList(trackId);
        }
    }

    return (
        <Button
            variant={data?.isTrackIn ? "foreground" : "outline"}
            size="icon"
            className="rounded-full !size-7"
            disabled={isLoading || isPending}
            onClick={toogle}
        >
            <PlusIcon className="!size-4" />
        </Button>
    )
}