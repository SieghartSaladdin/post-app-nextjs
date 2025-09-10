import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await getServerSession(authOptions);
    
    // Redirect ke login jika belum login
    if (session) {
        redirect('/');
    }
    
    return (
        <div>
            {children}
        </div>
    );
}