ALTER TABLE "AcademyEnrollment"
  ADD COLUMN "qualificationLevel" TEXT NOT NULL DEFAULT 'CERTIFICATE',
  ADD COLUMN "qualificationFeeKsh" DECIMAL(14,2) NOT NULL DEFAULT 1500;

ALTER TABLE "AcademyPayment"
  ADD COLUMN "qualificationLevel" TEXT NOT NULL DEFAULT 'CERTIFICATE';

-- Preserve the actual amount already paid by historical learners for display/audit.
UPDATE "AcademyEnrollment"
SET "qualificationFeeKsh" = "amountPaid"
WHERE "amountPaid" > 0;
