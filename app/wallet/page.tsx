
"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  membershipStatus: string;
  membershipPaidAt?: string | null;
};

export default function Wallet() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadUser() {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Please sign in.");
        return;
      }

      setUser(result.user);
    } catch {
      setError("Unable to load your account.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUser();
  }, []);

  useEffect(() => {
    const payment = new URLSearchParams(
      window.location.search,
    ).get("payment");

    if (!payment) return;

    async function verifyReturnedPayment() {
      setMessage("Confirming your payment...");
      setError("");

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reference: payment }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Payment verification failed.");
          setMessage("");
          return;
        }

        setMessage(
          result.alreadyProcessed
            ? "Your membership is already active."
            : "Payment confirmed. Your membership is now active.",
        );

        window.history.replaceState({}, "", "/wallet");
        await loadUser();
      } catch {
        setError("Unable to verify your payment.");
        setMessage("");
      }
    }

    void verifyReturnedPayment();
  }, []);

  async function activateMembership() {
    setPaying(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to start membership payment.");
        return;
      }

      window.location.href = result.authorization_url;
    } catch {
      setError("Unable to connect to Paystack.");
    } finally {
      setPaying(false);
    }
  }

  async function checkPaidMembership() {
    setCheckingPayment(true);
    setError("");
    setMessage("Checking your existing payment with Paystack...");

    try {
      const response = await fetch("/api/payments/check", {
        method: "POST",
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Your payment could not be confirmed yet.");
        setMessage("");
        return;
      }

      setMessage(
        result.alreadyActive
          ? "Your membership is already active."
          : "Payment confirmed. Your membership is now active.",
      );

      await loadUser();
    } catch {
      setError("Unable to check your payment. Please try again.");
      setMessage("");
    } finally {
      setCheckingPayment(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-2xl">
          <p>Loading your Corevia Network wallet...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="mt-3 text-red-700">{error || "Please sign in."}</p>
          <a
            href="/login"
            className="mt-6 inline-block rounded-xl bg-[#12352c] px-5 py-3 font-semibold text-white"
          >
            Sign In
          </a>
        </div>
      </main>
    );
  }

  const active = user.membershipStatus === "ACTIVE";
  const busy = paying || checkingPayment;

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
          Corevia Network
        </p>

        <h1 className="mt-2 text-3xl font-bold">Wallet</h1>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#12352c]/10">
          <p className="text-sm text-[#12352c]/60">Membership status</p>
          <p className="mt-2 text-2xl font-bold">
            {active ? "ACTIVE" : user.membershipStatus}
          </p>

          {active ? (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
              <h2 className="font-bold text-green-800">
                Membership Active
              </h2>
              <p className="mt-2 text-sm leading-6 text-green-700">
                Your membership is active following payment verification.
                You can now access the member dashboard.
              </p>
              <button
                type="button"
                disabled
                className="mt-5 w-full rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white"
              >
                ✓ ACTIVATED
              </button>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#b99a58]/30 bg-[#f7f5ef] p-5">
              <h2 className="text-xl font-bold">Activate Membership</h2>
              <p className="mt-2 text-sm leading-6 text-[#12352c]/70">
                The one-time Corevia Network activation fee is KES 1,000.
                If you have already paid, check that payment before trying
                to pay again.
              </p>

              <button
                type="button"
                onClick={activateMembership}
                disabled={busy}
                className="mt-5 w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying ? "Opening Paystack..." : "Pay KES 1,000 & Activate"}
              </button>

              <button
                type="button"
                onClick={checkPaidMembership}
                disabled={busy}
                className="mt-3 w-full rounded-xl border-2 border-[#b99a58] bg-white px-5 py-3.5 font-semibold text-[#12352c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingPayment
                  ? "Checking Payment..."
                  : "I've Paid — Activate My Account"}
              </button>
            </div>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <a
            href="/dashboard"
            className="mt-6 block text-center text-sm font-semibold underline"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
