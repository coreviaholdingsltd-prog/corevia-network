"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Withdrawal = {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: string;
  reference: string;
  createdAt: string;
  processedAt?: string | null;
  mpesaReceiptNumber?: string | null;
};

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const requestKeyRef = useRef<string | null>(null);
  const hasPendingWithdrawal = withdrawals.some(
    (withdrawal) => withdrawal.status === "PENDING" || withdrawal.status === "PROCESSING",
  );

  async function loadWithdrawals() {
    try {
      const response = await fetch("/api/withdrawals", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to load withdrawal details.");
        return;
      }

      setBalance(Number(result.balance || 0));
      setWithdrawals(result.withdrawals || []);
    } catch {
      setError("Unable to connect to the withdrawal service.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadWithdrawals();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function submitWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    if (!requestKeyRef.current) requestKeyRef.current = window.crypto.randomUUID();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          requestKey: requestKeyRef.current,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to submit withdrawal.");
        return;
      }

      setMessage(
        `Withdrawal request ${result.withdrawal.reference} submitted successfully.`,
      );
      setAmount("");
      // A new key is used only after the server has acknowledged this request.
      requestKeyRef.current = null;

      await loadWithdrawals();
    } catch {
      setError("Unable to connect to the withdrawal service.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-2xl">
          <p>Loading withdrawal details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
          Corevia Rise
        </p>

        <h1 className="mt-2 text-3xl font-bold">Withdraw</h1>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#12352c]/10">
          <p className="text-sm text-[#12352c]/60">
            Available wallet balance
          </p>

          <p className="mt-1 text-3xl font-bold">
            KES {balance.toFixed(2)}
          </p>

          <form onSubmit={submitWithdrawal} className="mt-7">
            <label htmlFor="withdrawal-amount" className="block text-sm font-semibold">
              Withdrawal amount
            </label>

            <input
              id="withdrawal-amount"
              type="number"
              min="500"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
              max={Math.min(balance, 150753.77).toFixed(2)}
              required
              className="mt-2 w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
            />

            <p className="mt-2 text-xs leading-5 text-[#12352c]/55">
              You may withdraw up to KES 150,753.77, subject to your available wallet balance. Corevia deducts a 0.50% fee. M-PESA B2C payouts are made in whole shillings, so the amount after the fee must be a whole KES amount. Maximum payout: KES 150,000.
            </p>

            <div role="note" className="mt-5 rounded-xl border border-[#b99a58]/30 bg-[#f7f5ef] px-4 py-3">
              <p className="text-sm font-semibold text-[#12352c]">Withdrawal Notice</p>
              <p className="mt-1 text-sm leading-6 text-[#12352c]/70">Your withdrawal is sent automatically to your registered M-PESA number. Processing may take up to 24 hours. A request is marked PAID only after Safaricom confirms the payout. Do not submit the same withdrawal again while it is PROCESSING.</p>
            </div>
            <button
              type="submit"
              disabled={submitting || balance <= 0 || hasPendingWithdrawal}
              className="mt-5 w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : hasPendingWithdrawal ? "Withdrawal Processing" : "Request Withdrawal"}
            </button>
          </form>

          {message && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#12352c]/10">
          <h2 className="text-xl font-bold">Withdrawal History</h2>

          {withdrawals.length === 0 ? (
            <p className="mt-4 text-sm text-[#12352c]/60">
              No withdrawal requests yet.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="rounded-2xl border border-[#12352c]/10 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        KES {Number(withdrawal.netAmount).toFixed(2)}
                      </p>

                      <p className="mt-1 text-xs text-[#12352c]/55">
                        {withdrawal.reference}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#f7f5ef] px-3 py-1 text-xs font-semibold">
                      {withdrawal.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-[#12352c]/55">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </p>
                  {withdrawal.mpesaReceiptNumber && (
                    <p className="mt-2 text-xs font-semibold text-[#12352c]">
                      M-PESA receipt: {withdrawal.mpesaReceiptNumber}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <a
          href="/dashboard"
          className="mt-6 block text-center text-sm font-semibold underline"
        >
          Back to Dashboard
        </a>
      </div>
    </main>
  );
}