import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { EditUserNameType } from "../types";
import { updateUserName } from "../actions";

export const useUpdateUserName = () => {
    const mutation = useMutation({
        mutationFn: (values: EditUserNameType) => updateUserName(values),
        onSettled: (data) => {
            if (data?.success) {
                toast.success("Updated");
                console.log(data.success)
            }
        }
    });

    return mutation;
}