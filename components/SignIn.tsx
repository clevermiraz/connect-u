import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

export default function SignIn() {
    return (
        <div className="container mx-auto flex flex-col w-full justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className="mx-auto h-6 w-6" />

                <h1 className="text-2xl font-semibold tracking-tight"> Welcome Back</h1>
                <p className="text-sm  mx-auto max-w-xs">
                    By Continuting, you are setting up a connectU account and agree to our User Agrement and privacy
                    policy.
                </p>

                <UserAuthForm />

                <p>
                    New to ConnectU?{" "}
                    <Link href="/sign-up" className="hover:text-zinc-800 text-sm underline underline-offset-4">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
