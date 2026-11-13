CREATE TABLE "CoreviaTillSettlement" (
    "id" TEXT NOT NULL,
    "ledgerEntryId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "reference" TEXT NOT NULL,
    "recipientCode" TEXT,
    "transferCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "initiatedAt" TIMESTAMP(3),
    "settledAt" TIMESTAMP(3),
    CONSTRAINT "CoreviaTillSettlement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CoreviaTillSettlement_ledgerEntryId_key" ON "CoreviaTillSettlement"("ledgerEntryId");
CREATE UNIQUE INDEX "CoreviaTillSettlement_reference_key" ON "CoreviaTillSettlement"("reference");
CREATE UNIQUE INDEX "CoreviaTillSettlement_transferCode_key" ON "CoreviaTillSettlement"("transferCode");
CREATE INDEX "CoreviaTillSettlement_status_createdAt_idx" ON "CoreviaTillSettlement"("status", "createdAt");
CREATE INDEX "CoreviaTillSettlement_status_updatedAt_idx" ON "CoreviaTillSettlement"("status", "updatedAt");
