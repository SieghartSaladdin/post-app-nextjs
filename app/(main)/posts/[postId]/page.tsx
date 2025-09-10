import Comments from "./components/comments";
import PostMain from "./components/postMain";

async function getPost(postId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`
  );

  if (!res.ok) {
    return undefined;
  }
  
  return res.json();
}

export default async function Page({
  params
}: {
  params: Promise<{ postId: number }>;
}) {
  const { postId } = await params;
  const post = await getPost(postId);

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <PostMain post={post} postId={postId}/>
      <Comments postId={postId} postComment={post.comments} />
    </div>
  );
}