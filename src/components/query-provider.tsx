"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

interface Props {
    children: React.ReactNode;
}

export const QueryProvider = ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
)