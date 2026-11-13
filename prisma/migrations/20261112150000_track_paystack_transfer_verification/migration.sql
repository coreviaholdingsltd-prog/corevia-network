ALTER TABLE "Withdrawal" ADD COLUMN "lastVerifiedAt" TIMESTAMP(3);
CREATE INDEX "Withdrawal_status_lastVerifiedAt_idx" ON "Withdrawal"("status", "lastVerifiedAt");
