import { useMutation } from "@tanstack/react-query";

import { EditUserEmailType } from "../types";
import { updateUserEmail } from "../actions";
import { toast } from "sonner";

export const useUpdateUserEmail = () => {
    const mutation = useMutation({
        mutationFn: (values: EditUserEmailType) => updateUserEmail(values),
        onSettled: (data) => {
            if (data?.success) {
                toast.success(`Check your inbox to verify your email address`);
            }
        }
    });

    return mutation;
}