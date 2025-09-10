import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const authorId = formData.get('authorId') as string;
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ success: false, error: 'Tidak ada file gambar yang diunggah.' }, { status: 400 });
    }
    
    // Pastikan folder 'public/assets' sudah ada
    const publicPath = path.join(process.cwd(), 'public', 'assets');
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(publicPath, filename);

    // Konversi File ke ArrayBuffer dan Buffer
    const buffer = Buffer.from(await image.arrayBuffer());

    // Tulis file ke direktori
    await writeFile(filePath, buffer);

    const imageUrl = `/assets/${filename}`;

    // Lanjutkan dengan Prisma, simpan path file di database
    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: imageUrl,
        authorId
      },
      include: {
        author: true
      }
    });

    revalidatePath('/posts');
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error saat memproses upload:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengunggah file.' }, { status: 500 });
  }
}