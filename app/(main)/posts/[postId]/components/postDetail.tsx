'use client';

import Image from "next/image";

export default function PostDetail({post} : {post: any}) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Title : {post.title}</h1>
      <div className="relative w-full max-w-[500px] aspect-[5/3]">
        <Image
          priority
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
        />
      </div>

      <p className="text-sm">Content : {post.content}</p>
    </div>
  )
}