import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { toast } from "sonner"

import { chooseProfile } from "../actions"

export const useChooseProfile = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (id: string) => await chooseProfile(id),
        onSettled: (data) => {
            if (data?.success) {
                router.push(`/`);
            }

            if (data?.error) {
                toast.error(data.error);
            }
        },
        onError: () => {
            toast.error("Something went wrong")
        }
    });

    return mutation;
}