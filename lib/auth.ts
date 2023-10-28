import { AxiosError } from "axios";
import { nanoid } from "nanoid";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import axios from "@/lib/axios";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET!,

    pages: {
        signIn: "/sign-in",
    },

    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user = {
                    ...session.user!,
                    id: token.id!,
                    name: token.name!,
                    email: token.email!,
                    image: token.picture!,
                    username: token.username!,
                };
            }

            return session;
        },

        async jwt({ token, account }) {
            if (account) {
                try {
                    const user = {
                        name: token.name,
                        email: token.email,
                        image: token.picture,
                        username: nanoid(10),
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    };

                    const response = await axios.post("/core/register-user/", user);

                    token.id = response.data.id;
                    token.username = response.data.username;
                    token.email = response.data.email;
                    token.name = response.data.name;
                    token.image = response.data.image;

                    return token;
                } catch (err) {
                    if (err instanceof AxiosError) {
                        console.log(err.response?.data);
                    }
                }
            }
            return token;
        },

        async redirect() {
            return "/";
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
