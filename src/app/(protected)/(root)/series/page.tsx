import { Metadata } from "next";
import { SearchClient } from "../search/client";

export const metadata: Metadata = {
    title: "Series - Netflix"
}

const SeriesPage = () => {
    return (
        <SearchClient
            title="Series"
            defaultMovies={true}
            defaultSeries={false}
            showSeriesAndMoviesFilter={false}
        />
    )
}
 
export default SeriesPage;