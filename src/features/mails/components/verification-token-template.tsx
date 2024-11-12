import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";// Assuming you have a Text component
import { FC } from "react";

interface Props {
    name: string;
    email: string;
    token: string;
}

export const VerificationTokenTemplate: FC<Props> = ({
    name,
    email,
    token
}) => {
    return (
        <Card className="w-full min-w-[450px] max-w-[600px] shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    Hi, <span className="text-red-500">{name}!</span>
                </CardTitle>
                <CardDescription className="text-xs">
                    We noticed a request to verify your email for the <a href={process.env.NEXT_PUBLIC_APP_URL!} target="_blank"><span className="text-red-500 hover:text-red-400 transition font-medium">Netflix Clone</span></a> app. 
                    If you made this request, please use the button below to confirm your email.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <p className="text-neutral-400 text-sm font-medium">
                    Email: <span className="font-semibold text-red-500">{email}</span>
                </p>
                <Button
                    variant="primary"
                    size="lg"
                    asChild
                >
                    <a
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/email-verification?token=${token}`}
                        target="_blank"
                    >
                        Verify Email Address
                    </a>
                </Button>
            </CardContent>
            <CardFooter className="text-xs font-medium text-neutral-400">
                If you did not make this request, please ignore this email.
            </CardFooter>
        </Card>
    );
};