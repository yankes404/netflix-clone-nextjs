import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { z } from "zod"

import { registerSchema } from "../schemas"
import { register } from "../actions"

export const useRegister = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (
            values: z.infer<typeof registerSchema>
        ) => await register(values),
        onSuccess: (data) => {
            if (data?.success) {
                router.push("/create-profile");
            }
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    return mutation;
}