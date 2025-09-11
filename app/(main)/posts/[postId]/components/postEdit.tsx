'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from 'react';
import DialogAlert from '@/components/reusable/dialogAlert';
import Swal from 'sweetalert2';
import ImageUploader from "@/components/reusable/inputImageUploader";
import { Loader } from 'lucide-react';

export default function PostEdit({ 
  post, postId
}: { 
  post: Post, postId: string
}) {

  const router = useRouter();
  const [loading, setLoading] = useState(false); // Ganti dengan logika sesi yang sesuai
  const [submitLoading, setSubmitLoading] = useState(false); // Ganti dengan logika sesi yang sesuai


  const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    image: z
      .instanceof(File, {
      message: "File gambar diperlukan.",
      })
      .refine((file) => file.size < 5000000, "Ukuran file harus kurang dari 5MB.")
      .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      "Hanya file JPG, PNG, atau GIF yang diizinkan."
      )
      .optional(),
    content: z.string().min(1, 'Content is required'),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post.title,
      image: undefined,
      content: post.content || '',
    },
  });

  const submitFunc = async (data: z.infer<typeof formSchema>) => {
    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.image) {
      formData.append("image", data.image);
      }

      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to update post');
      }

      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: 'success',
        title: 'Success',
        text: 'Post updated successfully',
      })

    } catch (error) {
      console.error('Error updating post:', error);
    } finally {
      setSubmitLoading(false);
    }
  }

  const deleteFunc = async (postId: string) => {
    try {
      setLoading(true);

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        icon: "success",
        title: "Success",
        text: "Post deleted successfully",
      });

      router.push("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete post",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(submitFunc)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field}/>
              </FormControl>
              <FormDescription>This is the title of the post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={() => (
          <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
              <ImageUploader
                initialImageUrl={post.image} // biar ada preview kalau value sudah ada (misal dari DB)
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
                <Input placeholder="Content" {...field}/>
              </FormControl>
              <FormDescription>This is the content of the post.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <div className='flex gap-4 items-center'>
            <Button disabled={submitLoading} type="submit">
              {submitLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Update Post
            </Button>
            <DialogAlert
              loading={loading}
              name='Delete Post'
              variant='destructive'
              submitFunction={() => deleteFunc(post.id.toString())}
              title='Yakin ingin menghapus post ini?'
              description={`Data yang sudah dihapus tidak dapat dikembalikan. Post Id : ${post.id}`}
            />
          </div>
      </form>
    </Form>
  )
}