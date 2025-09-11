import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { supabase } from "@/lib/supabase"; // pastikan ada helper supabase client

// GET detail post by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { comments: { include: { author: true } } },
  })
  return NextResponse.json(post)
}

// UPDATE post
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File | null;

    // ambil post lama dari DB
    const oldPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    let imageUrl = oldPost?.image ?? null;

    // kalau ada file image baru
    if (image) {
      // kalau ada image lama → delete di Supabase
      if (oldPost?.image) {
        const oldPath = oldPost.image.split("/").pop(); // ambil nama file
        if (oldPath) {
          await supabase.storage.from("imagePosts").remove([oldPath]);
        }
      }

      // upload file baru
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("imagePosts")
        .upload(fileName, image, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json(
          { success: false, error: uploadError.message },
          { status: 500 }
        );
      }

      // ambil public URL
      const { data: publicUrl } = supabase.storage
        .from("imagePosts")
        .getPublicUrl(fileName);

      imageUrl = publicUrl.publicUrl;
    }

    // update DB
    const updated = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        image: imageUrl ?? undefined,
      },
    });

    revalidatePath("/posts");
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error("Error saat update post:", error);
    return NextResponse.json(
      { success: false, error: "Gagal update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // cari post dulu biar tahu image-nya
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post tidak ditemukan" },
        { status: 404 }
      );
    }

    // hapus image di Supabase kalau ada
    if (post.image) {
      const oldPath = post.image.split("/").pop(); // ambil nama file
      if (oldPath) {
        const { error: removeError } = await supabase.storage
          .from("imagePosts")
          .remove([oldPath]);

        if (removeError) {
          console.error("Gagal hapus image di Supabase:", removeError);
        }
      }
    }

    // hapus post di DB
    await prisma.post.delete({ where: { id: Number(id) } });

    revalidatePath("/posts");
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error delete post:", error);
    return NextResponse.json(
      { success: false, error: "Gagal delete post" },
      { status: 500 }
    );
  }
}