"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.accounts.register.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.register.$post>;

export const useRegister = () => {
    const router = useRouter();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async({ json }) => {
            const response = await client.api.accounts.register.$post({ json });
        
            const jsonRes = await response.json();

            return jsonRes;
        },
        onSuccess: (data) => {
            if (!data.error) {
                toast.success("Registered");
                router.push("/");
            }
        },
    });

    return mutation;
}