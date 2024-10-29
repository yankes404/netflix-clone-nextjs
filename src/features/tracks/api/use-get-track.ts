import { useQuery } from "@tanstack/react-query"
import { getTrackById } from "../actions";

export const useGetTrack = (id: string) => {
    const query = useQuery({
        queryKey: ["track-by-id", id],
        queryFn: () => getTrackById(id)
    });

    return query;
}