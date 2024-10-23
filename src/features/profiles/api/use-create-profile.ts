import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query"
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<typeof client.api.profiles.$post, 200>;
type RequestType = InferRequestType<typeof client.api.profiles.$post>;

const res: ResponseType = { success: true };

export const useCreateProfile = () => {
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async ({ json }) => {
            const response = await client.api.profiles.$post({ json });
            // const jsonRes = await response.json();

            // if (!response.ok) {
            //     const error = 'error' in jsonRes ? jsonRes.error : "Something went wrong!";
            //     throw new Error(error);
            // }

            return await response.json();
        },
        onSettled: (data) => {
            console.log(data)
            if (data) {
            }
        },
    });

    return mutation;
}