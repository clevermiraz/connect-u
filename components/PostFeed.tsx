"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef } from "react";
import Post from "./Post";

interface PostFeedProps {
    initialPosts: any;
    subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
    const lastPostRef = useRef<HTMLElement>(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    const { data: session } = useSession();

    const fetchPosts = async ({ pageParam = 1 }) => {
        const query =
            `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
            (!!subredditName ? `&subredditName=${subredditName}` : "");
        const { data } = await axios.get(query);
        return data;
    };

    const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ["infinite-query"],
        queryFn: fetchPosts,
        initialPageParam: 0,
        initialData: { pages: [initialPosts], pageParams: [1] },
        getNextPageParam: (_lastPage, pages) => {
            if (pages?.length) {
                return pages?.length + 1;
            } else {
                return undefined;
            }
        },
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            if (hasNextPage) {
                fetchNextPage(); // Load more posts when the last post comes into view
            }
        }
    }, [entry, fetchNextPage, hasNextPage]);

    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

    return (
        <ul className="flex flex-col col-span-2 space-y-6">
            {posts.map((post, index) => {
                const votesAmt = post?.votes.reduce((acc: any, vote: any) => {
                    if (vote.type === "UP") return acc + 1;
                    if (vote.type === "DOWN") return acc - 1;
                    return acc;
                }, 0);

                const currentVote = post?.votes.find((vote: any) => vote.userId === session?.user.id);

                if (index === posts.length - 1) {
                    // Add a ref to the last post in the list
                    return (
                        <li key={post?.id} ref={ref}>
                            <Post
                                post={post}
                                commentAmt={post?.comments.length}
                                subredditName={post?.subredditName}
                                votesAmt={votesAmt}
                                currentVote={currentVote}
                            />
                        </li>
                    );
                } else {
                    return (
                        <Post
                            key={post?.id}
                            post={post}
                            commentAmt={post?.comments.length}
                            subredditName={post?.subredditName}
                            votesAmt={votesAmt}
                            currentVote={currentVote}
                        />
                    );
                }
            })}

            {isFetchingNextPage && (
                <li className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                </li>
            )}
        </ul>
    );
};

export default PostFeed;
