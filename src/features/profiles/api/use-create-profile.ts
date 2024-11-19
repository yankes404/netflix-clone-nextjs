"use client"

import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"

import { z } from "zod"
import { toast } from "sonner"

import { createProfileSchema } from "../schemas"
import { createProfile } from "../actions"

export const useCreateProfile = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async (
            values: z.infer<typeof createProfileSchema>
        ) => await createProfile(values),
        onSettled: (data) => {
            console.log(data);
            if (data?.success) {
                toast.success("Created profile", {
                    action: {
                        label: "Home",
                        onClick: () => window.location.assign("/")
                    }
                })
            }
            if (data?.error) {
                toast.error(data.error);
            }
        },
    });

    return mutation;
}