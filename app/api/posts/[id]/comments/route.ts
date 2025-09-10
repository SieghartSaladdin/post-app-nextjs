import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;  // ambil id dari Promise
  const formData = await req.formData();
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;

  const comment = await prisma.comments.create({
    data: {
      content,
      author: { connect: { id: authorId } },
      post: { connect: { id: Number(id) } },
    },
  });

  revalidatePath(`/posts/${id}`);
  revalidatePath(`/posts`);

  return NextResponse.json(comment);
}
