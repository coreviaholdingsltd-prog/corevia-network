ALTER TABLE "User"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "privacyNoticeVersion" TEXT;

ALTER TABLE "MemberProfile"
ALTER COLUMN "isPublic" SET DEFAULT false;
