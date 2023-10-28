"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

export default function ReactQueryProviders({ children }: LayoutProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
    );
}
