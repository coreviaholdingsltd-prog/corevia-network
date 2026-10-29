-- Add explicit transaction types for internal wallet transfers and their fee.
ALTER TYPE "TransactionType" ADD VALUE 'WALLET_TRANSFER_SENT';
ALTER TYPE "TransactionType" ADD VALUE 'WALLET_TRANSFER_RECEIVED';
ALTER TYPE "TransactionType" ADD VALUE 'WALLET_TRANSFER_FEE';
