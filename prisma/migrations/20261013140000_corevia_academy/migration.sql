CREATE TYPE "AcademyEnrollmentStatus" AS ENUM ('PENDING_PAYMENT', 'ACTIVE', 'COMPLETED');

CREATE TABLE "AcademyEnrollment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "status" "AcademyEnrollmentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "amountPaid" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "AcademyEnrollment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyLessonProgress" (
  "id" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "lessonId" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademyLessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyAssessmentAttempt" (
  "id" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  "totalQuestions" INTEGER NOT NULL,
  "passed" BOOLEAN NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademyAssessmentAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyCompletion" (
  "id" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "certificateCode" TEXT NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademyCompletion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AcademyPayment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "provider" TEXT NOT NULL,
  "providerReference" TEXT NOT NULL,
  "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AcademyPayment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AcademyEnrollment_userId_courseId_key" ON "AcademyEnrollment"("userId", "courseId");
CREATE INDEX "AcademyEnrollment_userId_status_idx" ON "AcademyEnrollment"("userId", "status");
CREATE INDEX "AcademyEnrollment_courseId_status_idx" ON "AcademyEnrollment"("courseId", "status");
CREATE UNIQUE INDEX "AcademyLessonProgress_enrollmentId_lessonId_key" ON "AcademyLessonProgress"("enrollmentId", "lessonId");
CREATE INDEX "AcademyLessonProgress_enrollmentId_idx" ON "AcademyLessonProgress"("enrollmentId");
CREATE INDEX "AcademyAssessmentAttempt_enrollmentId_createdAt_idx" ON "AcademyAssessmentAttempt"("enrollmentId", "createdAt");
CREATE UNIQUE INDEX "AcademyCompletion_enrollmentId_key" ON "AcademyCompletion"("enrollmentId");
CREATE UNIQUE INDEX "AcademyCompletion_certificateCode_key" ON "AcademyCompletion"("certificateCode");
CREATE UNIQUE INDEX "AcademyPayment_providerReference_key" ON "AcademyPayment"("providerReference");
CREATE INDEX "AcademyPayment_userId_createdAt_idx" ON "AcademyPayment"("userId", "createdAt");
CREATE INDEX "AcademyPayment_enrollmentId_status_idx" ON "AcademyPayment"("enrollmentId", "status");

ALTER TABLE "AcademyEnrollment" ADD CONSTRAINT "AcademyEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyLessonProgress" ADD CONSTRAINT "AcademyLessonProgress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademyEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyAssessmentAttempt" ADD CONSTRAINT "AcademyAssessmentAttempt_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademyEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyCompletion" ADD CONSTRAINT "AcademyCompletion_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademyEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyPayment" ADD CONSTRAINT "AcademyPayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AcademyPayment" ADD CONSTRAINT "AcademyPayment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "AcademyEnrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
