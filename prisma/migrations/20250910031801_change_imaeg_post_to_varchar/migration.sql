/*
  Warnings:

  - You are about to alter the column `image` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.

*/
-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "image" SET DATA TYPE VARCHAR(500);
