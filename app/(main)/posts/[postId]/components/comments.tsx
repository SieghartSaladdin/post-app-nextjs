'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddComment from "./addComment";

export default function Comments({ postComment, postId }: { postComment: any[], postId: number }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl mb-2">Comments:</h1>
      <hr />
      <AddComment postId={postId} />
      <div className="space-y-2">
        {postComment.map((comment, index) => (
          <div 
            key={index} 
            className="flex flex-col gap-2"
          >
            <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src={comment.author.image || ""} alt={comment.author.name || ""} />
                    <AvatarFallback>
                    {comment.author.name
                        ? comment.author.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{comment.author.name}</span>
                    <p className="text-sm">{comment.content}</p>
                </div>
            </div>
            <hr  className="mt-2"/>
          </div>
        ))}
      </div>
    </div>
  );
}
