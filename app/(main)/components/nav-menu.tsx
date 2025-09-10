'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavMenu() {
  const pathname = usePathname();
  
  return (
    <div className='flex items-center gap-8'>
      <Link 
        href="/" 
        className={`hover:text-red-600 hover:bg-black dark:hover:bg-white rounded-xl py-2 px-4 ${pathname === '/' ? 'text-red-600 font-bold bg-black dark:bg-white' : ''}`}
      >
        Home
      </Link>
      <Link 
        href="/posts" 
        className={`hover:text-red-600 hover:bg-black dark:hover:bg-white rounded-xl py-2 px-4 ${pathname.startsWith('/posts') ? 'text-red-600 font-bold bg-black dark:bg-white' : ''}`}
      >
        Posts
      </Link>
    </div>
  );
}