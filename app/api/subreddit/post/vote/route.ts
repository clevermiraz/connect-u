import { getAuthSession } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { PostVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();

        const { postId, voteType } = PostVoteValidator.parse(body);

        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const existingVote = await axiosInstance.get(`/api/r/votes/post/`, {
            params: {
                postId,
                userId: session?.user?.id,
            },
        });

        // const post = await axiosInstance.get(`/posts/${postId}`);

        if (existingVote?.status === 404) {
            return new Response("Post not found", { status: 404 });
        }

        if (existingVote?.status === 200) {
            await axiosInstance.patch(`/api/r/votes/`, {
                userId: session?.user?.id,
                existingVoteId: existingVote?.data?.id,
                voteType,
            });

            return new Response("Vote updated", { status: 200 });
        }

        const createVote = await axiosInstance.post("/api/r/votes/", {
            userId: session?.user?.id,
            postId,
            voteType,
        });

        if (createVote?.status === 201) {
            return new Response("Vote created", { status: 201 });
        }

        return new Response("Could not Register Vote at this time. Please try later", { status: 500 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response(error.message, { status: 422 });
        }

        return new Response("Could not Register Vote at this time. Please try later", { status: 500 });
    }
}
