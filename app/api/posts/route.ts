import { getAuthSession } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);

    const session = await getAuthSession();

    let followedCommunitiesIds: string[] = [];

    if (session) {
        const followedCommunities = await axiosInstance.get("/api/subscriptions", {
            params: {
                userId: session?.user?.id,
            },
        });

        followedCommunitiesIds = followedCommunities.data.map((sub: any) => sub.subredditId);
    }

    try {
        const { limit, page, subredditName } = z
            .object({
                limit: z.string(),
                page: z.string(),
                subredditName: z.string().nullish().optional(),
            })
            .parse({
                subredditName: url.searchParams.get("subredditName"),
                limit: url.searchParams.get("limit"),
                page: url.searchParams.get("page"),
            });

        let whereClause = {};

        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName,
                },
            };
        } else if (session) {
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        }

        const posts = await axiosInstance.get("/api/r/posts", {
            params: {
                limit,
                page,
                subredditName,
            },
        });

        return NextResponse.json(posts.data, { status: 200 });
    } catch (error) {
        return new Response("Could not fetch posts", { status: 500 });
    }
}
