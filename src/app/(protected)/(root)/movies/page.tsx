import { Metadata } from "next";
import { SearchClient } from "../search/client";

export const metadata: Metadata = {
    title: "Movies - Netflix"
}

const Movies = () => {
    return (
        <SearchClient
            title="Movies"
            defaultMovies={false}
            defaultSeries={true}
            showSeriesAndMoviesFilter={false}
        />
    )
}
 
export default Movies;