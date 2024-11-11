import { Metadata } from "next";
import { Suspense } from "react";

import { SearchClient } from "./client";

export const metadata: Metadata = {
    title: "Search - Netflix"
}

const SearchPage = () => {
    return (
        <Suspense>
            <SearchClient />
        </Suspense>
    )
}
 
export default SearchPage;