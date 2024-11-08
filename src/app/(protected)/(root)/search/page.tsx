import { Metadata } from "next";
import { SearchClient } from "./client";

export const metadata: Metadata = {
    title: "Search - Netflix"
}

const SearchPage = () => {
    return <SearchClient />
}
 
export default SearchPage;