
"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  membershipStatus: string;
};

type Referral = {
  id: string;
  name: string;
  registeredAt: string;
  membershipStatus: string;
  membershipPaidAt: string | null;
  rewardEarned: number;
};

type ReferralData = {
  total: number;
  active: number;
  pending: number;
  clients: Referral[];
};

const COREVIA_NETWORK_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://network.coreviaholdingltd.com";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralData | null>(null);
  const [error, setError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (!response.ok) {
          setError("Please sign in to access your dashboard.");
          return;
        }

        const result = await response.json();
        setUser(result.user);

        const referralResponse = await fetch("/api/my-referrals", {
          cache: "no-store",
        });

        const referralResult = await referralResponse.json();

        if (!referralResponse.ok || !referralResult.status) {
          setReferralError(
            referralResult.error || "Unable to load your referrals.",
          );
          return;
        }

        setReferrals(referralResult);
      } catch {
        setError("Unable to load your account. Please try again.");
      }
    }

    loadDashboard();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-4xl">
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
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        Loading your Corevia Network account...
      </main>
    );
  }

  const baseUrl = COREVIA_NETWORK_URL.replace(/\/+$/, "");
  const referralLink =
    `${baseUrl}/register?ref=${encodeURIComponent(user.referralCode)}`;

  async function copyReferralLink() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Unable to copy referral link.");
    }
  }

  const money = (amount: number) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 2,
    }).format(amount);

  const date = (value: string) =>
    new Date(value).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const totalRewards =
    referrals?.clients.reduce(
      (sum, client) => sum + client.rewardEarned,
      0,
    ) ?? 0;

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-4 text-[#12352c] sm:p-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
          Corevia Network
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Welcome, {user.name}
        </h1>
        <p className="mt-2 text-[#12352c]/65">
          Your member dashboard
        </p>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
          <h2 className="text-xl font-bold">Your Referral Link</h2>
          <p className="mt-2 text-sm leading-6 text-[#12352c]/65">
            Share this link to invite new members to Corevia Network.
          </p>

          <div className="mt-4 rounded-xl bg-[#f7f5ef] p-4">
            <p className="break-all text-sm font-medium">{referralLink}</p>
          </div>

          <button
            type="button"
            onClick={copyReferralLink}
            className="mt-4 w-full rounded-xl bg-[#12352c] px-5 py-3 font-semibold text-white"
          >
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#12352c]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a58]">
                Referral Code
              </p>
              <p className="mt-1 text-lg font-bold">{user.referralCode}</p>
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
            className="mt-5 block w-full rounded-xl bg-[#b99a58] px-5 py-3 text-center font-semibold text-[#12352c]"
          >
            {user.membershipStatus === "ACTIVE"
              ? "Open Wallet"
              : "Activate Membership"}
          </a>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">My Referred Clients</h2>
          <p className="mt-2 text-sm text-[#12352c]/65">
            Track registrations made through your referral link.
          </p>

          {referralError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-white p-4 text-sm text-red-700">
              {referralError}
            </div>
          )}

          {!referrals && !referralError && (
            <p className="mt-4 rounded-xl bg-white p-5">
              Loading your referred clients...
            </p>
          )}

          {referrals && (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">All Referrals</p>
                  <p className="mt-1 text-2xl font-bold">{referrals.total}</p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">Active</p>
                  <p className="mt-1 text-2xl font-bold">{referrals.active}</p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">Pending</p>
                  <p className="mt-1 text-2xl font-bold">{referrals.pending}</p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">Recorded Rewards</p>
                  <p className="mt-1 text-xl font-bold">{money(totalRewards)}</p>
                </div>
              </div>

              {referrals.clients.length === 0 ? (
                <div className="mt-5 rounded-2xl bg-white p-6 text-center ring-1 ring-[#12352c]/10">
                  <h3 className="font-bold">No referred clients yet</h3>
                  <p className="mt-2 text-sm text-[#12352c]/65">
                    Share your referral link. Clients who register through
                    it will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {referrals.clients.map((client) => (
                    <article
                      key={client.id}
                      className="rounded-2xl bg-white p-5 ring-1 ring-[#12352c]/10"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{client.name}</h3>
                          <p className="mt-1 text-sm text-[#12352c]/65">
                            Registered: {date(client.registeredAt)}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            client.membershipStatus === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : client.membershipStatus === "SUSPENDED"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {client.membershipStatus}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 border-t border-[#12352c]/10 pt-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-[#12352c]/65">
                            Membership payment date
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {client.membershipPaidAt
                              ? date(client.membershipPaidAt)
                              : "Not yet activated"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-[#12352c]/65">
                            Reward recorded for this client
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {money(client.rewardEarned)}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
