'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import z, { set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { useState } from "react";

export default function AddComment( { postId }: { postId: number } ) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const formSchema = {
        content: z.string().min(2).max(1000).trim().min(2).max(1000),
    };

    const form = useForm({
        resolver: zodResolver(z.object(formSchema)),
        defaultValues: {
            content: "",
        },
    });

    async function commentSubmit(data: any) {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('content', data.content);
            formData.append('authorId', session?.user.id as string);

            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }
            form.reset();
            Swal.fire({
                toast: true,
                position: "top-end",
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                icon: "success",
                title: "Comment Created",
                text: "Your comment has been created successfully.",
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <div className="flex flex-col gap-2">
            <h1>Add Comment :</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(commentSubmit)}>
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <Input placeholder="Comment Content" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="flex justify-end mt-4">
                        <Button  type="submit" disabled={loading}>
                            {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}