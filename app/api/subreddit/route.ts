import { getAuthSession } from "@/lib/auth";
import axios from "@/lib/axios";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return NextResponse.json("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = SubredditValidator.parse(body);

        const response = await axios.post("/api/create-community/", {
            name,
            email: session?.user?.email,
            id: session?.user?.id,
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(error.message, { status: 422 });
        }

        if (error instanceof AxiosError) {
            if (error.response?.status === 409) {
                return NextResponse.json("Subreddit already exists", { status: 409 });
            }
        }

        return NextResponse.json("Could not create subreddit", { status: 500 });
    }
}
