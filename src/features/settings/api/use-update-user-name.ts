import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { EditUserNameType } from "../types";
import { updateUserName } from "../actions";

export const useUpdateUserName = () => {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (values: EditUserNameType) => updateUserName(values),
        onSettled: (data) => {
            if (data?.success) {
                window.location.reload();
            }
        }
    });

    return mutation;
}