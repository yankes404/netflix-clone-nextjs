import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query"

import { createVerificationToken } from "@/features/auth/actions";

export const useSendVerificationEmail = () => {
    const { data: session } = useSession();

    const mutation = useMutation({
        mutationFn: async () => {
            if (!session || !session.user) {
                return { error: "Not logged in" }
            }

            return await createVerificationToken(
                session.user.email,
                session.user.name
            )
        },
        onSettled: (data) => {
            if (data?.error) {
                toast.error(data.error);
            } else {
                toast.success("Check your inbox to verify email address");
            }
        }
    });

    return mutation;
}