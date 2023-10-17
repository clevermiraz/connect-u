"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

interface UserAuthFormProps extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { toast } = useToast();

    const loginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await signIn("google");
        } catch (error) {
            // toast notification
            toast({
                title: "There Was a Problem",
                description: "There Was an error While Login With Google",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex justify-center", className)} {...props}>
            <Button onClick={loginWithGoogle} isLoading={isLoading} size="sm" className="w-full">
                {isLoading ? null : <Icons.google className="w-4 h-4 mr-2" />}
                Google
            </Button>
        </div>
    );
}
