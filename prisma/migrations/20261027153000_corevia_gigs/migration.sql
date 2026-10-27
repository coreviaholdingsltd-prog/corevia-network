-- Corevia Rise Gigs MVP
CREATE TYPE "GigStatus" AS ENUM ('PENDING_REVIEW', 'OPEN', 'PAUSED', 'CLOSED', 'REJECTED');
CREATE TYPE "GigWorkMode" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');
CREATE TYPE "GigBudgetType" AS ENUM ('FIXED', 'HOURLY', 'NEGOTIABLE');
CREATE TYPE "GigApplicationStatus" AS ENUM ('SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'DECLINED');

CREATE TABLE "Gig" (
  "id" TEXT NOT NULL,
  "ownerId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "location" TEXT,
  "workMode" "GigWorkMode" NOT NULL DEFAULT 'REMOTE',
  "budgetKsh" INTEGER,
  "budgetType" "GigBudgetType" NOT NULL DEFAULT 'NEGOTIABLE',
  "deadline" TIMESTAMP(3),
  "status" "GigStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GigApplication" (
  "id" TEXT NOT NULL,
  "gigId" TEXT NOT NULL,
  "applicantId" TEXT NOT NULL,
  "proposal" TEXT NOT NULL,
  "portfolioUrl" TEXT,
  "status" "GigApplicationStatus" NOT NULL DEFAULT 'SUBMITTED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GigApplication_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Gig_status_createdAt_idx" ON "Gig"("status", "createdAt");
CREATE INDEX "Gig_ownerId_createdAt_idx" ON "Gig"("ownerId", "createdAt");
CREATE INDEX "Gig_category_status_idx" ON "Gig"("category", "status");
CREATE UNIQUE INDEX "GigApplication_gigId_applicantId_key" ON "GigApplication"("gigId", "applicantId");
CREATE INDEX "GigApplication_applicantId_createdAt_idx" ON "GigApplication"("applicantId", "createdAt");
CREATE INDEX "GigApplication_gigId_status_idx" ON "GigApplication"("gigId", "status");

ALTER TABLE "Gig" ADD CONSTRAINT "Gig_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GigApplication" ADD CONSTRAINT "GigApplication_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GigApplication" ADD CONSTRAINT "GigApplication_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
