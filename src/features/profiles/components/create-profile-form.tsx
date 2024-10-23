"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { createProfileSchema } from "../schemas";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "./avatar-selector";
import { ProfileImage } from "../types";
import { useSession } from "next-auth/react";
import { useCreateProfile } from "../api/use-create-profile";
import { LoaderCircleIcon } from "lucide-react";

type FormType = z.infer<typeof createProfileSchema>;

export const CreateProfileForm = () => {
    const { mutate, isPending } = useCreateProfile();

    const { data: session } = useSession();
    const searchParams = useSearchParams();

    const form = useForm<FormType>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            name: "",
            image: ProfileImage.RED
        }
    });

    if (!session || !session.user) return null;

    const firstProfile = !!searchParams.get("first-profile");

    const onSubmit = (values: FormType) => {
        mutate({ ...values, userId: session.user.id })
    }

    return (
        <Card className="w-full lg:w-[550px]">
            <CardHeader>
                <CardTitle className="text-xl">
                    New Profile
                </CardTitle>
                {firstProfile && (
                    <CardDescription>
                        You have to create a new profile to use all our all features.
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
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
                                        Profile Name
                                    </FormLabel>
                                    <FormControl {...field}>
                                        <Input
                                            placeholder="Enter the name"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Profile Image
                                    </FormLabel>
                                    <FormControl>
                                        <AvatarSelector
                                            value={field.value}
                                            onChange={field.onChange}
                                            disabled={false}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full flex flex-wrap gap-2 mt-2">
                            {firstProfile && (
                                <Button
                                    size="lg"
                                    variant="outline"
                                    type="button"
                                    className="w-full lg:w-auto"
                                    disabled={isPending}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button
                                size="lg"
                                variant="primary"
                                type="submit"
                                className="w-full lg:w-auto ml-auto"
                                disabled={isPending}
                            >
                                {isPending && (
                                    <LoaderCircleIcon
                                        className="size-4 animate-spin"
                                    />
                                )}
                                Create Profile
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}