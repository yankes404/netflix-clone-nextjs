import { useQuery } from "@tanstack/react-query";
import { SearchTracksProps } from "../types";
import { searchTracks } from "../actions";

export const useSearchTracks = ({
    search,
    types,
    categories
}: SearchTracksProps) => {
    const query = useQuery({
        queryKey: [
            "tracks-search",
            search,
            types,
            categories
        ],
        queryFn: () => searchTracks({ search, types, categories })
    });

    return query;
}