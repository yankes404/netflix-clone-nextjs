import { useMutation } from "@tanstack/react-query"

import { z } from "zod"
import { toast } from "sonner"

import { createProfileSchema } from "../schemas"
import { updateProfile } from "../actions"
import { queryClient } from "@/components/query-provider"

export const useUpdateProfile = (profileId?: string) => {
    const mutation = useMutation({
        mutationFn: async (
            values: z.infer<typeof createProfileSchema>
        ) => {
            if (profileId) {
                return await updateProfile(profileId, values);
            }
        },
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Updated");
                queryClient.invalidateQueries({ queryKey: ["profiles"] });
            }
            if (data?.error) {
                toast.error(data.error);
            }
        },
    });

    return mutation;
}