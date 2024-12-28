import { useQuery } from "@tanstack/react-query";

import { stringToHex } from "@/lib/utils";

import { homePageRecords } from "../constants";
import { getHomeRecords } from "../actions";

export const useGetHomeRecords = () => {
    const jsonId = stringToHex(JSON.stringify(homePageRecords));

    const query = useQuery({
        queryKey: ["home-records", jsonId],
        queryFn: () => getHomeRecords()
    });

    return query;
}