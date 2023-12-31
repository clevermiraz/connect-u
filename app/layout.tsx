import Navbar from "@/components/Navbar";
import ReactQueryProviders from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Connect U",
    description: "An Extensive Learning Path",
};

export default function RootLayout({ children, authModal }: { children: React.ReactNode; authModal: React.ReactNode }) {
    return (
        <html lang="en" className={cn("bg-white text-slate-900 antialiased light", inter.className)}>
            <body className="min-h-screen pt-12 bg-slate-50 antialiased">
                <ReactQueryProviders>
                    <Navbar />
                    {authModal}
                    <div className="container max-w-7xl mx-auto h-full pt-12">{children}</div>
                    <Toaster />
                </ReactQueryProviders>
            </body>
        </html>
    );
}
