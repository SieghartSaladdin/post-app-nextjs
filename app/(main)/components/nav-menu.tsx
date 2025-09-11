'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, ChevronRight } from 'lucide-react';

interface NavMenuProps {
  onItemClick?: () => void;
}

export default function NavMenu({ onItemClick }: NavMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      href: '/posts',
      label: 'Posts',
      icon: FileText,
      isActive: pathname.startsWith('/posts')
    },
  ];
  
  return (
    <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto'>
      {menuItems.map((item) => (
        <Link 
          key={item.href}
          href={item.href} 
          onClick={onItemClick}
          className={`
            group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full md:w-auto
            ${item.isActive 
              ? 'bg-foreground text-background font-medium' 
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }
          `}
        >
          <item.icon size={20} className={`
            ${item.isActive ? 'text-background' : 'text-muted-foreground group-hover:text-foreground'}
          `} />
          <span className="font-medium">{item.label}</span>
          {/* Mobile arrow indicator */}
          <ChevronRight 
            size={16} 
            className={`
              ml-auto md:hidden transition-transform group-hover:translate-x-1
              ${item.isActive ? 'text-background' : 'text-muted-foreground'}
            `} 
          />
        </Link>
      ))}
    </div>
  );
}