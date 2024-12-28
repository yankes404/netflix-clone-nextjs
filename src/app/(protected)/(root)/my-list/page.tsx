import { Metadata } from "next";

import { MyListClient } from "./client";

export const metadata: Metadata = {
    title: "My list - Netflix"
}

const MyListPage = () => {
    return <MyListClient />
}
 
export default MyListPage;