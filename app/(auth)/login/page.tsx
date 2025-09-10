"use client"

// Library & Hooks
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Ikon
import { FaGoogle } from "react-icons/fa";
import { Mail, Lock, Loader2 } from "lucide-react";

// Komponen shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// 1. Definisikan skema validasi dengan Zod
const formSchema = z.object({
  email: z.string().email({
    message: "Format email tidak valid.",
  }),
  password: z.string().min(1, {
    message: "Password tidak boleh kosong.",
  }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // 2. Definisikan form dengan React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Buat fungsi onSubmit untuk handle login
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        ...values,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat login dengan Google');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Selamat Datang Kembali!</CardTitle>
          <CardDescription>Silakan masuk untuk melanjutkan.</CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md dark:bg-red-900 dark:text-red-200 dark:border-red-600">
              {error}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input placeholder="anda@contoh.com" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end text-sm">
                <Link href="#" className="font-medium text-primary hover:underline">
                  Lupa password?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Masuk
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn} disabled={loadingGoogle}>
            {loadingGoogle ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FaGoogle className="w-4 h-4 mr-2" />}
            Masuk dengan Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-center text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}