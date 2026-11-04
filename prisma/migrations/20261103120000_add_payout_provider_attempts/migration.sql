CREATE TYPE "PayoutProvider" AS ENUM ('DARAJA', 'PAYSTACK');
CREATE TYPE "PayoutProviderAttemptStatus" AS ENUM ('PREFLIGHT', 'SUBMITTED', 'ACCEPTED', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REVERSED', 'AMBIGUOUS');

ALTER TABLE "Withdrawal" ADD COLUMN "payoutProvider" "PayoutProvider";

CREATE TABLE "PayoutProviderAttempt" (
  "id" TEXT NOT NULL,
  "withdrawalId" TEXT NOT NULL,
  "provider" "PayoutProvider" NOT NULL,
  "attemptNumber" INTEGER NOT NULL,
  "providerReference" TEXT NOT NULL,
  "providerTransferId" TEXT,
  "status" "PayoutProviderAttemptStatus" NOT NULL DEFAULT 'PREFLIGHT',
  "requestPayload" JSONB,
  "responsePayload" JSONB,
  "errorCode" TEXT,
  "errorDescription" TEXT,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "nextAttemptAt" TIMESTAMP(3),
  "retryCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PayoutProviderAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PayoutProviderAttempt_providerReference_key" ON "PayoutProviderAttempt"("providerReference");
CREATE UNIQUE INDEX "PayoutProviderAttempt_withdrawalId_attemptNumber_key" ON "PayoutProviderAttempt"("withdrawalId", "attemptNumber");
CREATE INDEX "PayoutProviderAttempt_provider_status_nextAttemptAt_idx" ON "PayoutProviderAttempt"("provider", "status", "nextAttemptAt");
CREATE INDEX "PayoutProviderAttempt_withdrawalId_createdAt_idx" ON "PayoutProviderAttempt"("withdrawalId", "createdAt");

ALTER TABLE "PayoutProviderAttempt"
  ADD CONSTRAINT "PayoutProviderAttempt_withdrawalId_fkey"
  FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
