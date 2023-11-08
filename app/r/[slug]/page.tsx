import MiniCreatePost from "@/components/MiniCreatePost";
// import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import { notFound } from "next/navigation";

interface SubredditDetailsPageProps {
    params: {
        slug: string;
    };
}

export default async function SubredditDetailsPage({ params }: SubredditDetailsPageProps) {
    const { slug } = params;

    const session = await getAuthSession();

    // const subreddit = await db.subreddit.findFirst({
    //     where: { name: slug },
    //     include: {
    //         posts: {
    //             include: {
    //                 author: true,
    //                 votes: true,
    //                 comments: true,
    //                 subreddit: true,
    //             },
    //             orderBy: {
    //                 createdAt: "desc",
    //             },
    //             take: INFINITE_SCROLL_PAGINATION_RESULTS,
    //         },
    //     },
    // });

    const response = await axiosInstance.get(`/api/subreddit/posts/${slug}`);
    const subredditWithPosts = response.data;

    if (!subredditWithPosts) return notFound();

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl h-14">r/{subredditWithPosts.name}</h1>
            <MiniCreatePost session={session} />
            {/* <PostFeed initialPosts={subredditWithPosts.posts} subredditName={subredditWithPosts.name} /> */}
        </>
    );
}
