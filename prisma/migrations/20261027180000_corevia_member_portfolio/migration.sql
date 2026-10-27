-- Corevia Network member portfolio profiles and public work samples.
CREATE TABLE "MemberProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "headline" TEXT NOT NULL DEFAULT '',
  "bio" TEXT NOT NULL DEFAULT '',
  "location" TEXT,
  "skills" TEXT NOT NULL DEFAULT '',
  "websiteUrl" TEXT,
  "linkedinUrl" TEXT,
  "githubUrl" TEXT,
  "isPublic" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MemberProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortfolioItem" (
  "id" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT,
  "description" TEXT NOT NULL,
  "projectUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemberProfile_userId_key" ON "MemberProfile"("userId");
CREATE INDEX "MemberProfile_isPublic_updatedAt_idx" ON "MemberProfile"("isPublic", "updatedAt");
CREATE INDEX "PortfolioItem_profileId_createdAt_idx" ON "PortfolioItem"("profileId", "createdAt");

ALTER TABLE "MemberProfile" ADD CONSTRAINT "MemberProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "MemberProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
