import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserProfile from './components/user-profile';
import NavMenu from './components/nav-menu';
import { ModeToggle } from "@/components/mode-toggle";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="p-8">
      <nav className="grid grid-cols-2 items-center mb-8">
        <div className="flex items-center gap-4">
          <ModeToggle />
          <UserProfile />
          <h1 className="text-xl font-bold">Posts App</h1>
        </div>
        <div className="flex justify-end">
          <NavMenu />
        </div>
      </nav>
      {children}
    </div>
  );
}