ALTER TABLE "AcademyPayment"
  ADD COLUMN "providerCheckoutId" TEXT,
  ADD COLUMN "merchantRequestId" TEXT,
  ADD COLUMN "mpesaReceiptNumber" TEXT,
  ADD COLUMN "payerPhone" TEXT;

CREATE UNIQUE INDEX "AcademyPayment_providerCheckoutId_key"
  ON "AcademyPayment"("providerCheckoutId");
CREATE UNIQUE INDEX "AcademyPayment_mpesaReceiptNumber_key"
  ON "AcademyPayment"("mpesaReceiptNumber");
