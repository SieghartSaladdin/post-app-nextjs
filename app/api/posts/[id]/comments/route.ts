import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  req: Request,
  { params }: { params: { id: number } }
) {
  
  const formData = await req.formData();
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;

  const comment = await prisma.comments.create({
    data: {
      content,
      author: {
        connect: { id: authorId },
      },
      post: {
        connect: { id: Number(params.id) }
      }
    },
  });

  revalidatePath(`/posts/${params.id}`);
  revalidatePath(`/posts`);
  return NextResponse.json(comment);
}