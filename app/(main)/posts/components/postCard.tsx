'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Comments from '../[postId]/components/comments';
import { Post } from '@/types/post';

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div className='flex flex-col gap-4 mt-4'>
      
      <div
        className="border relative flex flex-col border-black dark:border-white w-[300px] rounded-xl overflow-hidden"
      >
        <div
          onClick={() => {
            router.push(`/posts/${post.id}`);
          }}
          className="relative w-[300px] h-[250px] cursor-pointer"
        >
          <Image
            src={post.image || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover rounded-t-xl"
            sizes="(max-width: 768px)"
            priority
          />
        </div>
        <div className='flex flex-col gap-8 py-2 px-4'>
          <div className='flex flex-col gap-2'>
            <h1 className="font-bold text-xl">{post.title}</h1>
            <p className="line-clamp-4 text-sm">{post.content}</p>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <span>Author : {post.author.name}</span>
            <Dialog>
              <DialogTrigger>
                <span className='text-blue-500 cursor-pointer'>Comments Here</span>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                      {post.title}
                    </DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <div className='overflow-y-auto max-h-[400px]'>
                  <Comments postId={post.id} postComment={post.comments} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
