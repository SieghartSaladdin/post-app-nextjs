import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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

// PUT (Edit post)
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const data = await req.json()
  const { id } = await context.params
  const updated = await prisma.post.update({
    where: { id: Number(id) },
    data,
  })

  revalidatePath('/posts')
  return NextResponse.json(updated)
}

// DELETE post
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ signature benar
) {
  const { id } = await context.params
  await prisma.post.delete({ where: { id: Number(id) } })
  revalidatePath('/posts')
  return NextResponse.json({ message: 'Post deleted' })
}
