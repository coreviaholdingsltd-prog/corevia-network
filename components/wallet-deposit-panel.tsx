"use client";

import { useEffect, useState, type FormEvent } from "react";

type Props = { onDeposited: () => Promise<void> };

export default function WalletDepositPanel({ onDeposited }: Props) {
  const [amount, setAmount] = useState("1000");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("deposit");
    if (!reference) return;
    let cancelled = false;
    async function verifyReturnedDeposit() {
      setBusy(true);
      setError("");
      try {
        const response = await fetch("/api/wallet/deposit/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok || result.status !== true) throw new Error(result.error || "Payment is not confirmed yet.");
        if (cancelled) return;
        setMessage(result.alreadyProcessed ? "This wallet deposit was already credited." : "Deposit confirmed and added to your wallet.");
        window.history.replaceState({}, "", "/wallet");
        await onDeposited();
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to verify this deposit. Refresh and try again.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    void verifyReturnedDeposit();
    return () => { cancelled = true; };
  }, [onDeposited]);

  async function startDeposit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/wallet/deposit/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const result = await response.json();
      if (!response.ok || result.status !== true || !result.authorization_url) {
        throw new Error(result.error || "Unable to start Paystack checkout.");
      }
      window.location.href = result.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start wallet deposit.");
      setBusy(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
      <h2 className="text-xl font-bold">Add Funds to Wallet</h2>
      <p className="mt-2 text-sm leading-6 text-[#12352c]/70">
        Deposit KES 100 to KES 150,000 securely through Paystack. Your wallet is credited only after the payment is verified.
      </p>
      <form onSubmit={startDeposit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="walletDepositAmount" className="mb-2 block text-sm font-semibold">Deposit amount (KES)</label>
          <input
            id="walletDepositAmount"
            type="number"
            min="100"
            max="150000"
            step="0.01"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={busy}
            className="w-full rounded-xl border border-[#12352c]/20 bg-white px-4 py-3 text-[#12352c] outline-none focus:border-[#b99a58] disabled:bg-gray-100"
          />
        </div>
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
          {busy ? "Verifying / Opening Paystack..." : "Deposit with Paystack"}
        </button>
      </form>
      {message && <div role="status" className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
      {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    </section>
  );
}
