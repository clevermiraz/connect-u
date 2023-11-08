import { getAuthSession } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
// import { db } from "@/lib/db";
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

        // check if user has already subscribed or not
        const subscription = await axiosInstance.get(
            `/api/r/check-subreddit-subscription/?subredditId=${subredditId}&userId=${session?.user.id}`
        );

        const isSubscriptionExists = !!subscription?.data.status;

        if (!isSubscriptionExists) {
            return new Response("You've not been subscribed to this subreddit, yet.", {
                status: 400,
            });
        }

        const subreddit = await axiosInstance.post(`/api/r/toggle-subreddit-subscription/`, {
            subredditId: subredditId,
            userId: session?.user.id,
        });

        if (subreddit.status === 403) {
            return new Response("You can't unsubscribe from your own subreddit", {
                status: 400,
            });
        }

        // else successfully unsubscribed
        return new Response(subredditId);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 400 });
        }

        return new Response("Could not unsubscribe from subreddit at this time. Please try later", { status: 500 });
    }
}
