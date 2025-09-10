'use client'

import { useState, useEffect } from "react"
import PostEdit from "./postEdit"
import PostDetail from "./postDetail";
import { useSession } from "next-auth/react";
import { Post } from '@/types/post';

export default function PostMain({post, postId}: {post: Post, postId: number}) {
    const [isSameSession, setSessionSame] = useState(false);
    const { data: session } = useSession();
    
    useEffect(() => {
        if(post.authorId === session?.user?.id) {
        setSessionSame(true);
        } else {
        setSessionSame(false);
        }
    }, [setSessionSame, session, post])
    return (
        <div>
            {isSameSession ? (
                <PostEdit post={post} postId={postId.toString()} />
            ) : (
                <PostDetail post={post} />
            )}

        </div>
    )
}