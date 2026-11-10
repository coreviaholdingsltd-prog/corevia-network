ALTER TABLE "Withdrawal"
  ADD COLUMN "requestKey" TEXT,
  ADD COLUMN "phoneNumber" TEXT,
  ADD COLUMN "originatorConversationId" TEXT,
  ADD COLUMN "conversationId" TEXT,
  ADD COLUMN "resultCode" INTEGER,
  ADD COLUMN "resultDescription" TEXT,
  ADD COLUMN "mpesaReceiptNumber" TEXT;

CREATE UNIQUE INDEX "Withdrawal_originatorConversationId_key"
  ON "Withdrawal"("originatorConversationId");

CREATE UNIQUE INDEX "Withdrawal_conversationId_key"
  ON "Withdrawal"("conversationId");

CREATE UNIQUE INDEX "Withdrawal_requestKey_key" ON "Withdrawal"("requestKey");
