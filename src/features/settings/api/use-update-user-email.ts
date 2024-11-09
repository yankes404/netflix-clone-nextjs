import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { EditUserEmailType } from "../types";
import { updateUserEmail } from "../actions";

export const useUpdateUserEmail = () => {
    const mutation = useMutation({
        mutationFn: (values: EditUserEmailType) => updateUserEmail(values),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Updated");
            }
        }
    });

    return mutation;
}