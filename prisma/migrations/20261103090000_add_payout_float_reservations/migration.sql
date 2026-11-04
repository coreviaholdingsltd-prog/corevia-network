CREATE TYPE "PayoutFloatReservationStatus" AS ENUM ('RESERVED', 'SETTLED', 'RELEASED');
CREATE TYPE "PayoutFloatEntryType" AS ENUM ('FUNDING', 'RESERVATION', 'SETTLEMENT', 'RELEASE');

CREATE TABLE "PayoutFloatAccount" (
  "id" TEXT NOT NULL DEFAULT 'primary',
  "availableBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "reservedBalance" DECIMAL(14,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PayoutFloatAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PayoutFloatReservation" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL DEFAULT 'primary',
  "withdrawalId" TEXT NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "status" "PayoutFloatReservationStatus" NOT NULL DEFAULT 'RESERVED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PayoutFloatReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PayoutFloatEntry" (
  "id" TEXT NOT NULL,
  "accountId" TEXT NOT NULL DEFAULT 'primary',
  "reference" TEXT NOT NULL,
  "type" "PayoutFloatEntryType" NOT NULL,
  "amount" DECIMAL(14,2) NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PayoutFloatEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PayoutFloatReservation_withdrawalId_key" ON "PayoutFloatReservation"("withdrawalId");
CREATE INDEX "PayoutFloatReservation_status_createdAt_idx" ON "PayoutFloatReservation"("status", "createdAt");
CREATE UNIQUE INDEX "PayoutFloatEntry_reference_key" ON "PayoutFloatEntry"("reference");
CREATE INDEX "PayoutFloatEntry_type_createdAt_idx" ON "PayoutFloatEntry"("type", "createdAt");

ALTER TABLE "PayoutFloatReservation"
  ADD CONSTRAINT "PayoutFloatReservation_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "PayoutFloatAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PayoutFloatReservation"
  ADD CONSTRAINT "PayoutFloatReservation_withdrawalId_fkey"
  FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PayoutFloatEntry"
  ADD CONSTRAINT "PayoutFloatEntry_accountId_fkey"
  FOREIGN KEY ("accountId") REFERENCES "PayoutFloatAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "PayoutFloatAccount" ("id", "availableBalance", "reservedBalance", "updatedAt")
VALUES ('primary', 0, 0, CURRENT_TIMESTAMP);
