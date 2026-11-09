CREATE TYPE "AcademyProjectStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUIRED', 'APPROVED', 'REJECTED');
CREATE TYPE "AcademyProjectDecision" AS ENUM ('APPROVED', 'REVISION_REQUIRED', 'REJECTED');

CREATE TABLE "AcademyProjectSubmission" (
  "id" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "projectTitle" TEXT NOT NULL,
  "objective" TEXT NOT NULL,
  "methodology" TEXT NOT NULL,
  "workDescription" TEXT NOT NULL,
  "reflection" TEXT NOT NULL,
  "evidenceUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "originalityConfirmed" BOOLEAN NOT NULL DEFAULT false,
  "status" "AcademyProjectStatus" NOT NULL DEFAULT 'SUBMITTED',
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademyProjectSubmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyProjectReview" (
  "id" TEXT NOT NULL,
  "submissionId" TEXT NOT NULL,
  "reviewerEmail" TEXT NOT NULL,
  "reviewerName" TEXT NOT NULL,
  "rubricScores" JSONB NOT NULL,
  "totalScore" INTEGER NOT NULL,
  "feedback" TEXT NOT NULL,
  "decision" "AcademyProjectDecision" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademyProjectReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyAcademicReference" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "stageKey" TEXT NOT NULL DEFAULT 'FOUNDATION',
  "title" TEXT NOT NULL,
  "authors" TEXT NOT NULL,
  "publication" TEXT NOT NULL,
  "publicationYear" INTEGER,
  "url" TEXT,
  "doi" TEXT,
  "sourceType" TEXT NOT NULL,
  "verificationNotes" TEXT,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "verifiedBy" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AcademyAcademicReference_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AcademyProjectSubmission_enrollmentId_submittedAt_idx" ON "AcademyProjectSubmission"("enrollmentId", "submittedAt");
CREATE INDEX "AcademyProjectSubmission_courseId_status_submittedAt_idx" ON "AcademyProjectSubmission"("courseId", "status", "submittedAt");
CREATE INDEX "AcademyProjectReview_submissionId_createdAt_idx" ON "AcademyProjectReview"("submissionId", "createdAt");
CREATE INDEX "AcademyProjectReview_reviewerEmail_createdAt_idx" ON "AcademyProjectReview"("reviewerEmail", "createdAt");
CREATE UNIQUE INDEX "AcademyAcademicReference_courseId_stageKey_title_key" ON "AcademyAcademicReference"("courseId", "stageKey", "title");
CREATE INDEX "AcademyAcademicReference_courseId_stageKey_verified_idx" ON "AcademyAcademicReference"("courseId", "stageKey", "verified");

ALTER TABLE "AcademyProjectSubmission" ADD CONSTRAINT "AcademyProjectSubmission_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademyEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyProjectReview" ADD CONSTRAINT "AcademyProjectReview_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "AcademyProjectSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
