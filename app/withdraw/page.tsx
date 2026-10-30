"use client";

import { FormEvent, useEffect, useState } from "react";

type Withdrawal = {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: string;
  reference: string;
  paymentReference?: string | null;
  createdAt: string;
  processedAt?: string | null;
};

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [payoutPhone, setPayoutPhone] = useState("");
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeRequestKey, setActiveRequestKey] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      setPayoutPhone(String(result.payoutPhone || ""));
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

  async function sendWithdrawal(
    requestedAmount: number | string,
    requestKey: string,
    clearAmount: boolean,
  ) {
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: requestedAmount,
          requestKey,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to submit withdrawal.");
        await loadWithdrawals();
        return;
      }

      setMessage(
        result.message ||
          "Your withdrawal request has been recorded.",
      );
      setActiveRequestKey(null);
      if (clearAmount) setAmount("");
      await loadWithdrawals();
    } catch {
      setError(
        "We could not confirm the response. Your request key has been kept so you can safely retry without creating a duplicate withdrawal.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function submitWithdrawal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let requestKey = activeRequestKey;
    if (!requestKey) {
      requestKey = window.crypto.randomUUID();
      setActiveRequestKey(requestKey);
    }

    await sendWithdrawal(amount, requestKey, true);
  }

  async function retryWithdrawal(withdrawal: Withdrawal) {
    const requestKey = withdrawal.reference.replace(/^cvwd_/, "");
    await sendWithdrawal(withdrawal.amount, requestKey, false);
  }

  function statusDescription(status: string) {
    switch (status) {
      case "PAID":
        return "Paystack confirmed the M-PESA payout.";
      case "PROCESSING":
        return "Sent to Paystack; awaiting final M-PESA confirmation.";
      case "PENDING":
        return "Recorded but not yet confirmed as sent. Retry after checking Paystack Balance.";
      case "FAILED":
      case "REJECTED":
        return "Payout unsuccessful. The reserved amount was returned to your wallet.";
      default:
        return status;
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

          <p className="mt-4 text-sm text-[#12352c]/70">
            M-PESA destination: <strong>{payoutPhone || "No phone number on account"}</strong>
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
              onChange={(event) => {
                setAmount(event.target.value);
                setActiveRequestKey(null);
              }}
              placeholder="Enter amount"
              max={balance.toFixed(2)}
              required
              className="mt-2 w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
            />

            <p className="mt-2 text-xs leading-5 text-[#12352c]/55">
              Minimum KES 500. Corevia deducts a 0.50% withdrawal fee from
              the requested amount; the remaining 99.50% is sent to the
              M-PESA number shown above. Check that this number is correct.
            </p>

            <div role="note" className="mt-5 rounded-xl border border-[#b99a58]/30 bg-[#f7f5ef] px-4 py-3">
              <p className="text-sm font-semibold text-[#12352c]">Withdrawal Notice</p>
              <p className="mt-1 text-sm leading-6 text-[#12352c]/70">
                Withdrawal requests are recorded in your wallet history and
                pushed to Paystack for M-PESA processing. Processing time
                depends on Paystack and the M-PESA network. A request marked
                Pending has not yet been confirmed as sent.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting || balance < 500}
              className="mt-5 w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Request Withdrawal"}
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
                        M-PESA payout: KES {Number(withdrawal.netAmount).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-[#12352c]/55">
                        Requested KES {Number(withdrawal.amount).toFixed(2)}
                        {" · "}fee KES {Number(withdrawal.fee).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-[#12352c]/55">
                        {withdrawal.reference}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#f7f5ef] px-3 py-1 text-xs font-semibold">
                      {withdrawal.status}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#12352c]/65">
                    {statusDescription(withdrawal.status)}
                  </p>

                  {withdrawal.paymentReference && (
                    <p className="mt-1 text-xs text-[#12352c]/55">
                      Paystack transfer: {withdrawal.paymentReference}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-[#12352c]/55">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </p>

                  {withdrawal.status === "PENDING" && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => void retryWithdrawal(withdrawal)}
                      className="mt-3 rounded-lg border border-[#12352c]/20 px-4 py-2 text-sm font-semibold disabled:opacity-50"
                    >
                      {submitting ? "Retrying..." : "Retry this withdrawal"}
                    </button>
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
