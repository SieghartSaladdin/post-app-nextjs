import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';
import { supabase } from "@/lib/supabase"; // client Supabase yg kita buat


// GET /api/posts
export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      comments: {
        include: {
          author: true, // <-- ini untuk ambil data user dari authorId
        },
      }
    }
    
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const authorId = formData.get("authorId") as string;
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file gambar yang diunggah." },
        { status: 400 }
      );
    }

    // bikin nama file unik
    const fileName = `${Date.now()}-${image.name}`;

    // upload ke bucket "imagePosts" di Supabase
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

    // ambil public URL dari file
    const { data: publicUrl } = supabase.storage
      .from("imagePosts")
      .getPublicUrl(fileName);

    // simpan URL ke database lewat Prisma
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: publicUrl.publicUrl, // simpan link supabase, bukan /assets
        authorId,
      },
      include: {
        author: true,
      },
    });

    revalidatePath("/posts");
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Error saat memproses upload:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengunggah file." },
      { status: 500 }
    );
  }
}