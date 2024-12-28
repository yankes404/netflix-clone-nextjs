"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/error-message";

import { EditUserNameType } from "../types";
import { editUserNameSchema } from "../schemas";

import { useUpdateUserName } from "../api/use-update-user-name";

interface Props {
    onSuccess?: () => void;
}

export const EditUserNameForm = ({ onSuccess }: Props) => {
    const { data: session } = useSession();

    const { mutate, isPending } = useUpdateUserName();

    const [error, setError] = useState<string | null>(null);

    const form = useForm<EditUserNameType>({
        resolver: zodResolver(editUserNameSchema),
        defaultValues: {
            name: session?.user.name ?? ""
        }
    });

    if (!session || !session.user) {
        return (
            <ErrorMessage message="You're not logged in" />
        )
    }

    const onSubmit = (values: EditUserNameType) => {
        setError(null);

        mutate(values, {
            onSettled: (data) => {
                setError(data?.error ?? null);
                if (data?.success) {
                    onSuccess?.();
                }
            }
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                New Name
                            </FormLabel>
                            <FormControl {...field}>
                                <Input
                                    placeholder="John Doe"
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ErrorMessage message={error} />
                <div className="mt-2 w-full flex justify-end">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isPending}
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}