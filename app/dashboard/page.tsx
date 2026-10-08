"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  membershipStatus: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadMember() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) {
          setError("Please sign in to access your dashboard.");
          return;
        }

        const result = await response.json();
        setUser(result.user);
      } catch {
        setError("Unable to load your account.");
      }
    }

    loadMember();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] p-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="mt-3 text-red-700">{error}</p>
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

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] p-6">
        <div className="mx-auto max-w-2xl">
          <p>Loading your Corevia Network account...</p>
        </div>
      </main>
    );
  }

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${encodeURIComponent(
          user.referralCode
        )}`
      : "";

  async function copyReferralLink() {
    if (!referralLink) return;

    await navigator.clipboard.writeText(referralLink);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] p-6">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
          Corevia Network
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, {user.name}
        </h1>

        <p className="mt-2 text-[#12352c]/65">
          Your member dashboard
        </p>

        <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#12352c]/10">
          <h2 className="text-xl font-bold">Your Referral Link</h2>

          <p className="mt-2 text-sm leading-6 text-[#12352c]/65">
            Share this link with someone you want to invite to Corevia
            Network.
          </p>

          <div className="mt-5 rounded-xl bg-[#f7f5ef] p-4">
            <p className="break-all text-sm font-medium">
              {referralLink}
            </p>
          </div>

          <button
            type="button"
            onClick={copyReferralLink}
            className="mt-4 w-full rounded-xl bg-[#12352c] px-5 py-3 font-semibold text-white"
          >
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#12352c]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a58]">
                Referral Code
              </p>
              <p className="mt-1 text-lg font-bold">
                {user.referralCode}
              </p>
            </div>

            <div className="rounded-2xl border border-[#12352c]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a58]">
                Membership
              </p>
              <p className="mt-1 text-lg font-bold">
                {user.membershipStatus}
              </p>
            </div>
          </div>

          <a
            href="/wallet"
            className="mt-6 block w-full rounded-xl bg-[#b99a58] px-5 py-3 text-center font-semibold text-[#12352c]"
          >
            {user.membershipStatus === "ACTIVE"
              ? "Open Wallet"
              : "Activate Membership"}
          </a>
        </div>
      </div>
    </main>
  );
}
