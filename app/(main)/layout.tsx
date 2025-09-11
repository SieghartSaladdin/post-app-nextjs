import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserProfile from './components/user-profile';
import NavMenu from './components/nav-menu';
import { ModeToggle } from "@/components/mode-toggle";
import Nav from './components/nav';

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
      <Nav/>
      {children}
    </div>
  );
}