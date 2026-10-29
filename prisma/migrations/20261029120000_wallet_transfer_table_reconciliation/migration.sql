-- Reconcile WalletTransfer with the source-controlled migration history.
-- Safe for databases where this table and its indexes already exist.

CREATE TABLE IF NOT EXISTS "WalletTransfer" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "requestKey" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "fee" DECIMAL(14,2) NOT NULL,
    "totalDebit" DECIMAL(14,2) NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "WalletTransfer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "WalletTransfer_senderId_fkey"
        FOREIGN KEY ("senderId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WalletTransfer_recipientId_fkey"
        FOREIGN KEY ("recipientId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Repair either foreign key if the table existed without that constraint.
DO $wallet_transfer_constraints$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'WalletTransfer_senderId_fkey'
          AND conrelid = 'public."WalletTransfer"'::regclass
    ) THEN
        ALTER TABLE "WalletTransfer"
            ADD CONSTRAINT "WalletTransfer_senderId_fkey"
            FOREIGN KEY ("senderId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'WalletTransfer_recipientId_fkey'
          AND conrelid = 'public."WalletTransfer"'::regclass
    ) THEN
        ALTER TABLE "WalletTransfer"
            ADD CONSTRAINT "WalletTransfer_recipientId_fkey"
            FOREIGN KEY ("recipientId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$wallet_transfer_constraints$;

CREATE UNIQUE INDEX IF NOT EXISTS "WalletTransfer_reference_key"
    ON "WalletTransfer"("reference");

CREATE UNIQUE INDEX IF NOT EXISTS "WalletTransfer_senderId_requestKey_key"
    ON "WalletTransfer"("senderId", "requestKey");

CREATE INDEX IF NOT EXISTS "WalletTransfer_senderId_createdAt_idx"
    ON "WalletTransfer"("senderId", "createdAt");

CREATE INDEX IF NOT EXISTS "WalletTransfer_recipientId_createdAt_idx"
    ON "WalletTransfer"("recipientId", "createdAt");
