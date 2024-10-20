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
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { loginSchema } from "../schemas";
import { signIn } from "next-auth/react";
import { useLogin } from "../api/use-login";
import { ErrorMessage } from "@/components/error-message";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

type FormType = z.infer<typeof loginSchema>;

export const SignInCard = ()  => {
    const { mutate, isPending } = useLogin();

    const form = useForm<FormType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });
    const [error, setError] = useState<string | null>(null);
    
    const [callbackUrl, setCallbackUrl] = useState(DEFAULT_LOGIN_REDIRECT);

    const searchParams = useSearchParams();
    const searchError = searchParams.get("error");
    const searchCallbackUrl = searchParams.get("callbackUrl");

    useEffect(() => {
        if (searchCallbackUrl) {
            setCallbackUrl(searchCallbackUrl);
        }
    }, [searchCallbackUrl]);

    useEffect(() => {
        if (searchError === "OAuthAccountNotLinked") {
            setError("Log in using the platform you logged in from the first time to this email address");
        }
    }, [searchError]);

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
        signIn(provider, {
            redirectTo: callbackUrl
        });
    }

    return (
        <Card className="w-full lg:w-[500px] rounded-md">
            <CardHeader>
                <CardTitle className="text-center text-xl">Welcome back</CardTitle>
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
                            Sign in
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
                        Sign in with Google
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleOauth("github")}
                    >
                        <FaGithub className="size-5" />
                        Sign in with Github
                    </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-xs font-semibold text-center text-muted-foreground">
                    New in Netflix? <Link href="/sign-up"><span className="text-red-500">Sign up</span></Link>
                </p>
            </CardContent>
        </Card>
    )
}