import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

import { z } from "zod"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"

import { loginSchema } from "../schemas"
import { login } from "../actions"

export const useLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const mutation = useMutation({
        mutationFn: async (
            values: z.infer<typeof loginSchema>
        ) => await login(values),
        onSuccess: (data) => {
            if (data?.success) {
                toast.success("Logged in");
                router.push(searchParams.get("callbackUrl") ?? DEFAULT_LOGIN_REDIRECT);
            }
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    });

    return mutation;
}