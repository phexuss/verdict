/*
  Warnings:

  - You are about to drop the column `status` on the `UserMovie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,movieId]` on the table `UserMovie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserMovieReaction" AS ENUM ('LIKED', 'DISLIKED');

-- DropIndex
DROP INDEX "UserMovie_movieId_idx";

-- DropIndex
DROP INDEX "UserMovie_userId_idx";

-- DropIndex
DROP INDEX "UserMovie_userId_movieId_status_key";

-- AlterTable
ALTER TABLE "UserMovie" DROP COLUMN "status",
ADD COLUMN     "reaction" "UserMovieReaction",
ADD COLUMN     "savedAt" TIMESTAMP(3),
ADD COLUMN     "watchedAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "UserMovieStatus";

-- CreateIndex
CREATE UNIQUE INDEX "UserMovie_userId_movieId_key" ON "UserMovie"("userId", "movieId");
