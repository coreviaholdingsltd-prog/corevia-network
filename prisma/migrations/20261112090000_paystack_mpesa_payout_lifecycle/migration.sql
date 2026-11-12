ALTER TABLE "Withdrawal"
  ADD COLUMN "beneficiaryPhone" TEXT,
  ADD COLUMN "recipientCode" TEXT,
  ADD COLUMN "payoutReference" TEXT,
  ADD COLUMN "transferCode" TEXT,
  ADD COLUMN "processorStatus" TEXT,
  ADD COLUMN "initiatedAt" TIMESTAMP(3),
  ADD COLUMN "settledAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "Withdrawal_payoutReference_key" ON "Withdrawal"("payoutReference");
CREATE UNIQUE INDEX "Withdrawal_transferCode_key" ON "Withdrawal"("transferCode");
CREATE INDEX "Withdrawal_status_createdAt_idx" ON "Withdrawal"("status", "createdAt");

CREATE TABLE "PaystackTransferWebhook" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "transferReference" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PaystackTransferWebhook_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaystackTransferWebhook_payloadHash_key" ON "PaystackTransferWebhook"("payloadHash");
CREATE UNIQUE INDEX "PaystackTransferWebhook_transferReference_eventType_key" ON "PaystackTransferWebhook"("transferReference", "eventType");
CREATE INDEX "PaystackTransferWebhook_receivedAt_idx" ON "PaystackTransferWebhook"("receivedAt");
