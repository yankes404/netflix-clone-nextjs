import { z } from "zod"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

import { registerSchema } from "../schemas"
import { register } from "../actions"

export const useRegister = () => {
    const mutation = useMutation({
        mutationFn: async (
            values: z.infer<typeof registerSchema>
        ) => await register(values),
        onSuccess: (data) => {
            if (data?.success) {
                window.location.assign("/profiles/create");
            }
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    return mutation;
}