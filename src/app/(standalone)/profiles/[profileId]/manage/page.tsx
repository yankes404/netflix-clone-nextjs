import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Profile - Netflix"
}

interface Props {
    params: { profileId: string }
}

const ManagePage = ({ params }: Props) => {
    return (
        <div>
            Manage {params.profileId}
        </div>
    )
}
 
export default ManagePage;