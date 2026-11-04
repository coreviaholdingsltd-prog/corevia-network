CREATE TYPE "FeeSettlementStatus" AS ENUM ('PENDING', 'SUBMITTED', 'SUCCEEDED', 'FAILED', 'BLOCKED', 'REVERSED');

CREATE TABLE "CoreviaFeeSettlement" (
  "id" TEXT NOT NULL,
  "withdrawalId" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "providerReference" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "status" "FeeSettlementStatus" NOT NULL DEFAULT 'PENDING',
  "transferCode" TEXT,
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "nextAttemptAt" TIMESTAMP(3),
  "submittedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CoreviaFeeSettlement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CoreviaFeeSettlement_withdrawalId_key" ON "CoreviaFeeSettlement"("withdrawalId");
CREATE UNIQUE INDEX "CoreviaFeeSettlement_reference_key" ON "CoreviaFeeSettlement"("reference");
CREATE UNIQUE INDEX "CoreviaFeeSettlement_providerReference_key" ON "CoreviaFeeSettlement"("providerReference");
CREATE INDEX "CoreviaFeeSettlement_status_nextAttemptAt_idx" ON "CoreviaFeeSettlement"("status", "nextAttemptAt");

ALTER TABLE "CoreviaFeeSettlement"
  ADD CONSTRAINT "CoreviaFeeSettlement_withdrawalId_fkey"
  FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
