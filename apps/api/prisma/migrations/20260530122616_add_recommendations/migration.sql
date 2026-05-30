-- CreateEnum
CREATE TYPE "RecommendationItemType" AS ENUM ('SAFE', 'RISK', 'WILDCARD');

-- CreateEnum
CREATE TYPE "RecommendationStatus" AS ENUM ('PENDING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT,
    "locale" "Locale" NOT NULL,
    "status" "RecommendationStatus" NOT NULL DEFAULT 'READY',
    "moods" TEXT[],
    "groupType" TEXT,
    "duration" TEXT,
    "title" TEXT,
    "description" TEXT,
    "aiReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendationItem" (
    "id" TEXT NOT NULL,
    "recommendationId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "RecommendationItemType" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecommendationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_slug_key" ON "Recommendation"("slug");

-- CreateIndex
CREATE INDEX "Recommendation_slug_idx" ON "Recommendation"("slug");

-- CreateIndex
CREATE INDEX "Recommendation_userId_idx" ON "Recommendation"("userId");

-- CreateIndex
CREATE INDEX "Recommendation_createdAt_idx" ON "Recommendation"("createdAt");

-- CreateIndex
CREATE INDEX "RecommendationItem_movieId_idx" ON "RecommendationItem"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationItem_recommendationId_movieId_key" ON "RecommendationItem"("recommendationId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendationItem_recommendationId_position_key" ON "RecommendationItem"("recommendationId", "position");

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "Recommendation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendationItem" ADD CONSTRAINT "RecommendationItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
