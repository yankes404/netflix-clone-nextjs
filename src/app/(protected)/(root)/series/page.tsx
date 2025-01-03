import { Suspense } from "react";
import { Metadata } from "next";

import { SearchClient } from "../search/client";

export const metadata: Metadata = {
    title: "Series - Netflix"
}

const SeriesPage = () => {
    return (
        <Suspense>
            <SearchClient
                title="Series"
                defaultMovies={true}
                defaultSeries={false}
                showSeriesAndMoviesFilter={false}
            />
        </Suspense>
    )
}
 
export default SeriesPage;