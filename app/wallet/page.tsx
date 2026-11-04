
"use client";

import { useCallback, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  membershipStatus: string;
  membershipPaidAt?: string | null;
};

type WalletTransaction = {
  id: string;
  type: string;
  status: string;
  amount: number;
  reference: string;
  description: string | null;
  createdAt: string;
  completedAt: string | null;
};

type WalletSummary = {
  balance: number;
  transactions: WalletTransaction[];
};

type PendingTransferDraft = {
  recipientCode: string;
  amount: string;
  requestKey: string;
};

type WalletSummaryResponse = {
  status?: boolean;
  error?: string;
  balance?: number;
  transactions?: WalletTransaction[];
};

type TransferResponse = {
  status?: boolean;
  error?: string;
  message?: string;
  reference?: string;
  recipient?: { name?: string; referralCode?: string };
  amount?: number;
  fee?: number;
  totalDebited?: number;
  remainingBalance?: number | null;
  alreadyProcessed?: boolean;
};

function formatKES(amount: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function transactionLabel(type: string) {
  const labels: Record<string, string> = {
    MEMBERSHIP_PAYMENT: "Membership payment",
    REFERRAL_REWARD: "Referral reward",
    SPIN_REWARD: "Spin reward",
    WITHDRAWAL: "Withdrawal",
    WITHDRAWAL_FEE: "Withdrawal fee",
    WALLET_TRANSFER_SENT: "Wallet transfer sent",
    WALLET_TRANSFER_RECEIVED: "Wallet transfer received",
    WALLET_TRANSFER_FEE: "Wallet transfer fee",
    ADJUSTMENT: "Wallet adjustment",
    WALLET_DEPOSIT: "Wallet deposit",
  };

  return (
    labels[type] ||
    type
      .split("_")
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(" ")
  );
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export...[truncated]                    setTransferAmount(event.target.value)
                    }
                    disabled={sendingTransfer || Boolean(pendingTransfer)}
                    required
                    className="w-full rounded-xl border border-[#12352c]/20 bg-white px-4 py-3 text-[#12352c] outline-none focus:border-[#b99a58] disabled:bg-gray-100"
                  />
                </div>

                {amountTextIsValid && (
                  <div className="rounded-2xl bg-[#f7f5ef] p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span>Recipient receives</span>
                      <span className="font-semibold">
                        {formatKES(previewAmountCents / 100)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between gap-4">
                      <span>Transfer fee (0.50%)</span>
                      <span className="font-semibold">
                        {formatKES(previewFeeCents / 100)}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-[#12352c]/15 pt-3">
                      <span className="font-bold">
                        Total debited from you
                      </span>
                      <span className="font-bold">
                        {formatKES(previewTotalCents / 100)}
                      </span>
                    </div>
                  </div>
                )}

                {pendingTransfer && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                    A transfer attempt is saved for retry. Keep the
                    recipient code and amount unchanged. Retrying uses
                    the same request key to help prevent a duplicate
                    debit. Do not start another transfer until this
                    ...[truncated]