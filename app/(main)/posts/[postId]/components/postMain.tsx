'use client'

import { useState, useEffect } from "react"
import PostEdit from "./postEdit"
import PostDetail from "./postDetail";
import { useSession } from "next-auth/react";

export default function PostMain({post, postId}: {post :any, postId: any}) {
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
                <PostEdit post={post} postId={postId} />
            ) : (
                <PostDetail post={post} />
            )}

        </div>
    )
}