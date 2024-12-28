import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { EditUserPasswordType } from "../types";
import { updateUserPassword } from "../actions";

export const useUpdateUserPassword = () => {
    const mutation = useMutation({
        mutationFn: (values: EditUserPasswordType) => updateUserPassword(values),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Updated");
            }
        }
    });

    return mutation;
}