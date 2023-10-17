import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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

        async jwt({ token, user }) {
            return token;
        },

        async redirect() {
            return "/";
        },
    },
};

export const getAuthSession = () => getServerSession(authOptions);
