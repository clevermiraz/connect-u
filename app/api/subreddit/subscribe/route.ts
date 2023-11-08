import { getAuthSession } from "@/lib/auth";
import { default as axios, default as axiosInstance } from "@/lib/axios";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { subredditId } = SubredditSubscriptionValidator.parse(body);

        // check if user has already subscribed to subreddit
        const subscription = await axiosInstance.get(
            `/api/r/check-subreddit-subscription/?subredditId=${subredditId}&userId=${session?.user.id}`
        );

        const isSubscriptionExists = !!subscription?.data.status;

        if (isSubscriptionExists) {
            return new Response("You've already subscribed to this subreddit", {
                status: 400,
            });
        }

        // create subreddit and associate it with the user
        await axios.post(`/api/r/toggle-subreddit-subscription/`, {
            subredditId: subredditId,
            userId: session?.user.id,
        });

        return new Response(subredditId);
    } catch (error) {
        error;
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 });
        }

        return new Response("Could not subscribe to subreddit at this time. Please try later", { status: 500 });
    }
}
