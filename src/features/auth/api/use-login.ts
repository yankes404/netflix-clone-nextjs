"use client";

import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type ResponseType = InferResponseType<typeof client.api.accounts.login.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.login.$post>;

export const useLogin = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [callbackUrl, setCallbackUrl] = useState(DEFAULT_LOGIN_REDIRECT);

    const searchCallbackUrl = searchParams.get("callbackUrl");

    useEffect(() => {
        if (searchCallbackUrl) {
            setCallbackUrl(searchCallbackUrl);
        }
    }, [searchCallbackUrl]);

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async({ json }) => {
            const response = await client.api.accounts.login.$post({ json });
        
            const jsonRes = await response.json();

            return jsonRes;
        },
        onSuccess: (data) => {
            if (!data.error) {
                toast.success("Logged in");
                router.push(callbackUrl);
            }
        },
    });

    return mutation;
}