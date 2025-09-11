-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comments_postId_fkey";

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
