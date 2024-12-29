import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { createCheckout } from "../actions";
import { SubscriptionType } from "../types";

export const useCreateCheckoutSession = () => {
    const router = useRouter();
    const pathname = usePathname();

    const mutation = useMutation({
        mutationFn: async (
            plan: SubscriptionType,
            cancelUrl: string = `${process.env.NEXT_PUBLIC_APP_URL}${pathname}`
        ) => await createCheckout(plan, cancelUrl),
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