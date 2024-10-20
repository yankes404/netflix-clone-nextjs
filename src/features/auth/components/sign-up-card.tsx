"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LoaderCircleIcon } from "lucide-react";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { signIn } from "next-auth/react";
import { ErrorMessage } from "@/components/error-message";
import { useState } from "react";

type FormType = z.infer<typeof registerSchema>;

export const SignUpCard = ()  => {
    const { mutate, isPending } = useRegister();

    const form = useForm<FormType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (values: FormType) => {
        setError(null);

        mutate({ json: values }, {
            onSuccess: (data) => {
                setError(data.error);

                if (!data.error) {
                    form.reset();
                }
            }
        });
    }

    const handleOauth = (
        provider: "github" | "google"
    ) => {
        signIn(provider);
    }

    return (
        <Card className="w-full lg:w-[500px] rounded-md">
            <CardHeader>
                <CardTitle className="text-center text-xl">Create Account</CardTitle>
                <CardDescription className="text-center text-xs">
                    By register you agree to our <Link href="/privacy-policy"><span className="text-foreground hover:opacity-75 transition">Privacy Policy</span></Link> and <Link href="/terms-of-service"><span className="text-foreground hover:opacity-75 transition">Terms of Service</span></Link>.
                </CardDescription>
            </CardHeader>
            <div className="px-6">
                <Separator />
            </div>
            <CardContent className="mt-6">
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
                                        Name
                                    </FormLabel>
                                    <FormControl {...field}>
                                        <Input
                                            placeholder="John"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                    </FormLabel>
                                    <FormControl {...field}>
                                        <Input
                                            type="email"
                                            placeholder="mail@example.com"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Password
                                    </FormLabel>
                                    <FormControl {...field}>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ErrorMessage message={error} />
                        <Button
                            className="mt-2"
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending && (
                                <LoaderCircleIcon
                                    className="size-4 animate-spin"
                                />
                            )}
                            Register
                        </Button>
                    </form>
                </Form>
                <Separator className="my-4" />
                <div className="flex flex-col gap-y-2">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleOauth("google")}
                    >
                        <FcGoogle className="size-5" />
                        Sign up with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleOauth("github")}
                    >
                        <FaGithub className="size-5" />
                        Sign up with Github
                    </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-xs font-semibold text-center text-muted-foreground">
                    Alrady have account? <Link href="/sign-in"><span className="text-red-500">Sign in</span></Link>
                </p>
            </CardContent>
        </Card>
    )
}