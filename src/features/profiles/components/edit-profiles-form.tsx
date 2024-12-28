"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetProfiles } from "../api/use-get-profiles";
import { useState } from "react";
import { LoaderCircleIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { MiniProfile } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AvatarSelector } from "./avatar-selector";
import Image from "next/image";
import { getProfileImage } from "@/lib/utils";
import { z } from "zod";
import { createProfileSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateProfile } from "../api/use-update-profile";
import Link from "next/link";

export const EditProfilesForm = () => {
    const { data: profiles, isLoading } = useGetProfiles();
    
    const [profile, setProfile] = useState<MiniProfile | null>(null);
    const { mutate: updateProfile, isPending } = useUpdateProfile(profile?.id);

    const form = useForm<z.infer<typeof createProfileSchema>>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            name: profile?.name,
            image: profile?.image,
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <LoaderIcon className="animate-spin" />
                <p>
                    Please wait, loading...
                </p>
            </div>
        )
    }

    const onProfileChange = (id: string) => {
        if (profiles) {
            const profile: MiniProfile | null = profiles.find((profile) => profile.id === id) ?? null;

            if (profile) {
                setProfile(profile);

                form.setValue("name", profile.name);
                form.setValue("image", profile.image);
            }
        }
    }

    const onSubmit = (values: z.infer<typeof createProfileSchema>) => {
        updateProfile(values);
    }

    return (
        <div className="w-full mt-6 flex flex-col gap-y-3">
            <div className="flex gap-2">
                <Select
                    value={profile?.id}
                    onValueChange={onProfileChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select profile..." />
                    </SelectTrigger>
                    <SelectContent>
                        {profiles?.map((profile) => (
                            <SelectItem
                                key={profile.id}
                                value={profile.id}
                            >
                                <div className="flex items-center gap-1.5">
                                    <Image
                                        src={getProfileImage(profile.image)}
                                        alt={profile.name}
                                        width={16}
                                        height={16}
                                        className="rounded-sm"
                                    />
                                    {profile.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    size="icon"
                    variant="foreground"
                    asChild
                    className="shrink-0"
                >
                    <Link href="/profiles/create">
                        <PlusIcon className="size-4" />
                    </Link>
                </Button>
            </div>
            {profile && (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            {profile.name}
                        </CardTitle>
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
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}