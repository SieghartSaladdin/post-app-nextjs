"use client";
// React and Next.js
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";


// UI Components
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import ImageUploader from "@/components/reusable/inputImageUploader";

export default function DialogAdd({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

   const formSchema = z.object({
        title: z.string().min(2, {
            message: "Title harus memiliki setidaknya 2 karakter.",
        }),
        image: z
            .instanceof(File, {
            message: "File gambar diperlukan.",
            })
            .refine((file) => file.size < 5000000, "Ukuran file harus kurang dari 5MB.")
            .refine(
            (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
            "Hanya file JPG, PNG, atau GIF yang diizinkan."
            ),
        content: z.string().min(2, {
            message: "Konten harus memiliki setidaknya 2 karakter.",
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image: undefined,
            content: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("authorId", session?.user?.id || "");
            if (data.image) {
            formData.append("image", data.image);
            }

            const res = await fetch("/api/posts", {
            method: "POST",
            body: formData, // 🚀 jangan pakai JSON.stringify
            });

            if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Request failed with status ${res.status}`);
            }

            Swal.fire({
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            icon: "success",
            title: "Post Created",
            text: "Your post has been created successfully.",
            });

            form.reset();
            router.refresh();
            setOpen(false);
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <DialogHeader>
                            <DialogTitle>Add New Post</DialogTitle>
                            <DialogDescription>
                                Fill in the fields below to create a new post.
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                <Input placeholder="Post Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                <ImageUploader
                                    onImageUpload={(file) => {
                                        if (file) {
                                            form.setValue("image", file, { shouldValidate: true });
                                        }
                                    }}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Post Content" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Submit
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}