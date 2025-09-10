import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // pastikan prisma client sudah di-setup
import { revalidatePath } from 'next/cache'

// GET detail post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
    include: {
      comments: {
        include: {
          author: true, // <-- ini untuk ambil data user dari authorId
        },
      }
    }
  })
  return NextResponse.json(post)
}

// PUT (Edit post)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await req.json()
  const updated = await prisma.post.update({
    where: { id: Number(params.id) },
    data,
  })

  revalidatePath('/posts');
  return NextResponse.json(updated)
}

// DELETE post
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.post.delete({
    where: { id: Number(params.id) },
  })
  
  revalidatePath('/posts');
  return NextResponse.json({ message: 'Post deleted' })
}