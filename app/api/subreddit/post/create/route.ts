Creating posts (editor, image upload)import { z } from "zod";

import { getAuthSession } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { title, content, subredditId } = PostValidator.parse(body);

        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        // check if user has already subscribed or not
        const subscription = await axiosInstance.get(
            `/api/r/check-subreddit-subscription/?subredditId=${subredditId}&userId=${session?.user.id}`
        );

        const isSubscriptionExists = !!subscription?.data.status;

        if (!isSubscriptionExists) {
            return new Response("Subscribe to post", {
                status: 403,
            });
        }

        await axiosInstance.post(`/api/r/create-post/`, {
            title,
            content,
            authorId: session.user.id,
            subredditId,
        });

        return new Response("OK");
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 });
        }

        return new Response("Could not post to subreddit at this time. Please try later", { status: 500 });
    }
}
