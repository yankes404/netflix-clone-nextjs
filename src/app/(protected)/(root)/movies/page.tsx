import { Metadata } from "next";
import { Suspense } from "react";

import { SearchClient } from "../search/client";

export const metadata: Metadata = {
    title: "Movies - Netflix"
}

const Movies = () => {
    return (
        <Suspense>
            <SearchClient
                title="Movies"
                defaultMovies={false}
                defaultSeries={true}
                showSeriesAndMoviesFilter={false}
            />
        </Suspense>
    )
}
 
export default Movies;