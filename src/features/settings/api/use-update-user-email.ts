import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { EditUserEmailType } from "../types";
import { updateUserEmail } from "../actions";

export const useUpdateUserEmail = () => {
    const mutation = useMutation({
        mutationFn: (values: EditUserEmailType) => updateUserEmail(values),
        onSettled: (data) => {
            if (data?.success) {
                if (process.env.NEXT_PUBLIC_USE_RESEND === "TRUE") {
                    toast.success("Check your inbox to verify email address");
                } else {
                    window.location.reload();
                }
            }
        }
    });

    return mutation;
}