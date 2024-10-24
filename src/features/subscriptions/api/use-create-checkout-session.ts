import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { createCheckout } from "../actions";
import { SubscriptionType } from "../types";

export const useCreateCheckoutSession = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (
            plan: SubscriptionType
        ) => await createCheckout(plan),
        onSuccess: (data) => {
            if ("url" in data && data.url) {
                router.push(data.url);
            } else {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.error("Something went wrong");
                }
            }
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    return mutation;
}