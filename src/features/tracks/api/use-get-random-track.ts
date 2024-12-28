import { useQuery } from "@tanstack/react-query";

import { getRandomTrack } from "../actions";

export const useGetRandomTrack = () => {
    const query = useQuery({
        queryKey: ["random-track"],
        queryFn: () => getRandomTrack()
    });

    return query;
}