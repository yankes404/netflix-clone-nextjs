"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

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

import { EditUserPasswordType } from "../types";
import { editUserPasswordSchema } from "../schemas";

import { useUpdateUserPassword } from "../api/use-update-user-password.ts"

interface Props {
    onSuccess?: () => void;
}

export const EditUserPasswordForm = ({ onSuccess }: Props) => {
    const { data: session } = useSession();

    const { mutate, isPending } = useUpdateUserPassword();

    const [error, setError] = useState<string | null>(null);

    const form = useForm<EditUserPasswordType>({
        resolver: zodResolver(editUserPasswordSchema),
        defaultValues: {
            password: ""
        }
    });

    if (!session || !session.user) {
        return (
            <ErrorMessage message="You're not logged in" />
        )
    }

    const onSubmit = (values: EditUserPasswordType) => {
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                New Password
                            </FormLabel>
                            <FormControl {...field}>
                                <Input
                                    type="password"
                                    placeholder="******"
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