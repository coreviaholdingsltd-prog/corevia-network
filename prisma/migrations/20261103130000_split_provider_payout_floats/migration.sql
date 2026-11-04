ALTER TABLE "PayoutFloatAccount"
  ADD COLUMN "provider" "PayoutProvider" NOT NULL DEFAULT 'DARAJA';

CREATE UNIQUE INDEX "PayoutFloatAccount_provider_key" ON "PayoutFloatAccount"("provider");

INSERT INTO "PayoutFloatAccount" ("id", "provider", "availableBalance", "reservedBalance", "createdAt", "updatedAt")
VALUES ('paystack', 'PAYSTACK', 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("provider") DO NOTHING;
