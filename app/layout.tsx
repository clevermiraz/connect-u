import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Connect U",
    description: "An Extensive Learning Path",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={cn("bg-white text-slate-900 antialiased light", inter.className)}>
            <body className="min-h-screen pt-12 bg-slate-50 antialiased">
                <Navbar />
                <div className="container max-w-7xl mx-auto h-full pt-12">{children}</div>
                <Toaster />
            </body>
        </html>
    );
}