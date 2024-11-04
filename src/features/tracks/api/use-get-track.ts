import { useQuery } from "@tanstack/react-query"
import { getTrackById } from "../actions";

export const useGetTrack = (id: string, episodeId?: string) => {
    const query = useQuery({
        queryKey: ["track-by-id", id, episodeId],
        queryFn: () => getTrackById(id, episodeId)
    });

    return query;
}