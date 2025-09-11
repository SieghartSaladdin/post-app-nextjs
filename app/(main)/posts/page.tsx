// Components
import PostCard from './components/postCard';
import DialogAdd from './components/dialogAdd';

// UI Components
import { Button } from '@/components/ui/button';
import { Meteors } from "@/components/magicui/meteors";
import { Globe } from '@/components/magicui/globe';

// Types
import { Post } from '@/types/post';

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const cardData = await fetch(`${baseUrl}/api/posts`,
    { cache: "force-cache" }
  );
  const posts: Post[] = await cardData.json();

  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const chunkedPosts = chunkArray(posts, 20);

  return (
    <div className="pt-12">
      <div className="flex flex-col gap-4">
        <DialogAdd>
          <Button className="w-fit">Add Posts</Button>
        </DialogAdd>
        {chunkedPosts.map((group, i) => (
          <div
            key={i}
            className={`border-2 mb-6 rounded-xl p-4 md:overflow-y-hidden relative ${
              group.length > 5 ? 'overflow-x-auto' : 'overflow-x-hidden'
            }
            ${
              group.length > 1 ? 'overflow-y-auto' : 'overflow-y-hidden'
            }`}
          >
            <Meteors number={100} />
            Info : {i * group.length + 1}-{(i + 1) * group.length} Post
            <div className={`flex flex-col items-center md:flex-row md:gap-12 md:h-auto ${
              group.length > 1 ? 'h-[500px]' : 'h-auto'
            }`}>
               {group.map((post: Post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
