import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChoosePlanClient } from "./client";

const ChoosePlan = async () => {
    const session = await auth();

    if (!session || !session.user) return redirect("/sign-in");

    return <ChoosePlanClient />
}
 
export default ChoosePlan;