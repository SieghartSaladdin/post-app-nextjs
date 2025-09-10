import { Globe } from "@/components/magicui/globe";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Selamat Datang, {session?.user?.name || "Pengguna"}!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Ini adalah ringkasan aktivitas Anda.
        </p>
      </div>

      <div className="relative w-full">
        <Globe />
      </div>
    </main>
  );
}