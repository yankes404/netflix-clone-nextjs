import { FC } from "react";

import { Html, Button, Head, Font, Body, Heading, Text, Link, Tailwind } from "@react-email/components";

interface TextLinkProps {
    href: string;
    children: React.ReactNode;
    target?: React.HTMLAttributeAnchorTarget;
}

export const TextLink = ({
    href,
    children,
    target
}: TextLinkProps) => {
    return (
        <Link
            href={href}
            target={target}
            style={{
                color: "#FF0000",
                fontWeight: "500",
                textDecoration: "none"
            }}
        >
            {children}
        </Link>
    )
}

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
        <Html lang="en" dir="ltr">
            <Head>
                <Font
                    fontFamily="Inter"
                    fallbackFontFamily="Arial"
                />
            </Head>
            <Body>
                <div
                    style={{
                        width: "450px",
                        maxWidth: "100%",
                        padding: "20px",
                        border: "1px solid hsl(0, 0%, 89.8%)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px 0 hsla(0, 0%, 0%, 0.1)"
                    }}
                >
                    <Heading
                        as="h1"
                        style={{
                            padding: "0",
                            margin: "0",
                            fontSize: "18px"
                        }}
                    >
                        Hi, <span style={{ color: "#FF0000" }}>{name}!</span>
                    </Heading>
                    <Text
                        style={{
                            fontSize: "12px",
                            fontWeight: "500",
                            marginTop: "4px",
                            color: "hsl(0, 0%, 45.1%)",
                            lineHeight: "20px"
                        }}
                    >
                        We noticed a request to verify your email for the&nbsp;<TextLink href={process.env.NEXT_PUBLIC_APP_URL!} target="_blank">Netflix Clone</TextLink>&nbsp;app. If you made this request, please use the button below to confirm your email.
                    </Text>
                    <Link
                        href={`${process.env.NEXT_PUBLIC_APP_URL}/email-verification?token=${token}`}
                        target="_blank"
                        style={{
                            background: "#FF0000",
                            color: "#FFF",
                            padding: "8px",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "11px",
                            width: "140px",
                            display: "block",
                            textAlign: "center",
                            boxShadow: "0 4px 8px 0 hsla(0, 0%, 0%, 0.1)"
                        }}
                    >
                        Verify Email Address
                    </Link>
                    <footer
                        style={{
                            color: "hsl(0, 0%, 45.1%)",
                            fontSize: "11px",
                            marginTop: "16px",
                            fontWeight: "500"
                        }}
                    >
                        If you did not make this request, please ignore this email.
                    </footer>
                </div>
            </Body>
        </Html>
    )
};