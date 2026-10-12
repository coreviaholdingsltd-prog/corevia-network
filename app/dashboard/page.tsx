
"use client";

import { useCallback, useEffect, useState } from "react";

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
  status: boolean;
  total: number;
  active: number;
  pending: number;
  clients: Referral[];
};

const COREVIA_NETWORK_URL = "https://network.coreviaholdingltd.com";

const money = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);

function formatDate(value: string | null | undefined) {
  if (!value) return "Not available";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return parsed.toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    if (!document.execCommand("copy")) {
      throw new Error("Copy command was not successful.");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralData | null>(null);
  const [error, setError] = useState("");
  const [referralError, setReferralError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setReferralError("");

    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        setError("Please sign in to access your dashboard.");
        return;
      }

      const result = await response.json();
      const account = result.user as User | undefined;

      if (!account?.id || !account?.referralCode) {
        setError("Your account information could not be loaded. Please sign in again.");
        return;
      }

      setUser(account);

      try {
        const referralResponse = await fetch("/api/my-referrals", {
          cache: "no-store",
        });

        const referralResult = await referralResponse.json();

        if (
          !referralResponse.ok ||
          referralResult.status !== true ||
          !Array.isArray(referralResult.clients)
        ) {
          setReferralError(
            referralResult.error || "Unable to load your referrals. Please try again.",
          );
          return;
        }

        setReferrals({
          status: true,
          total: Number(referralResult.total) || 0,
          active: Number(referralResult.active) || 0,
          pending: Number(referralResult.pending) || 0,
          clients: referralResult.clients.map((client: Referral) => ({
            ...client,
            rewardEarned: Number(client.rewardEarned) || 0,
          })),
        });
      } catch {
        setReferralError("Unable to load referral information. Please try again.");
      }
    } catch {
      setError("Unable to connect to Corevia Network. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const referralLink = user
    ? `${COREVIA_NETWORK_URL}/register?ref=${encodeURIComponent(
        user.referralCode,
      )}`
    : "";

  async function handleCopyReferralLink() {
    if (!referralLink) return;

    setCopyMessage("");
    setCopied(false);

    try {
      await copyText(referralLink);
      setCopied(true);
      setCopyMessage("Referral link copied successfully.");
    } catch {
      setCopyMessage(
        "Automatic copying failed. Select and copy the referral link above.",
      );
    }
  }

  const totalRewards =
    referrals?.clients.reduce(
      (sum, client) => sum + client.rewardEarned,
      0,
    ) ?? 0;

  async function handleSignOut() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Sign out failed.");
      }

      window.location.assign("/login");
    } catch {
      window.alert("Unable to sign out. Please try again.");
    }
  }
  if (loading && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#12352c]/15 border-t-[#b99a58]" />
          <p className="mt-4 font-medium">
            Loading your Corevia Network account...
          </p>
        </div>
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
            Corevia Network
          </p>
          <h1 className="mt-3 text-2xl font-bold">Member Dashboard</h1>
          <p role="alert" className="mt-4 text-red-700">
            {error}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/login"
              className="rounded-xl bg-[#12352c] px-5 py-3 font-semibold text-white"
            >
              Sign In
            </a>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="rounded-xl border border-[#12352c]/20 px-5 py-3 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-4 text-[#12352c] sm:p-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
              Corevia Network
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Welcome, {user.name}
            </h1>
            <p className="mt-2 text-sm text-[#12352c]/65">
              Your member dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadDashboard()}
            disabled={loading}
            className="rounded-xl border border-[#12352c]/20 bg-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </header>

        <nav aria-label="Member navigation" className="mt-6 flex flex-wrap gap-3">
          <a href="/dashboard" className="rounded-xl border border-[#12352c]/15 bg-white px-4 py-3 text-sm font-semibold">Dashboard</a>
          <a href="/wallet" className="rounded-xl border border-[#12352c]/15 bg-white px-4 py-3 text-sm font-semibold">Wallet</a>
          <a href="/withdraw" className="rounded-xl bg-[#b99a58] px-4 py-3 text-sm font-semibold text-[#12352c]">Withdraw Funds</a>
          <button type="button" onClick={handleSignOut} className="rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700">Sign Out</button>
        </nav>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
          <h2 className="text-xl font-bold">Your Referral Link</h2>
          <p className="mt-2 text-sm leading-6 text-[#12352c]/65">
            Invite new members to Corevia Network using your unique link.
            Your referral code is included automatically.
          </p>

          <div className="mt-4 rounded-xl bg-[#f7f5ef] p-4">
            <p className="break-all text-sm font-medium" aria-label="Your referral link">
              {referralLink}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyReferralLink}
            className="mt-4 w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white hover:bg-[#1b493c] focus:outline-none focus:ring-2 focus:ring-[#b99a58] focus:ring-offset-2"
          >
            {copied ? "Copied!" : "Copy Referral Link"}
          </button>

          {copyMessage && (
            <p
              role="status"
              className={`mt-3 text-sm ${
                copied ? "text-green-700" : "text-amber-800"
              }`}
            >
              {copyMessage}
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#12352c]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a58]">
                Referral Code
              </p>
              <p className="mt-1 break-all text-lg font-bold">
                {user.referralCode}
              </p>
            </div>

            <div className="rounded-2xl border border-[#12352c]/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#b99a58]">
                Membership Status
              </p>
              <p className="mt-1 text-lg font-bold">
                {user.membershipStatus}
              </p>
            </div>
          </div>

          <a
            href="/wallet"
            className="mt-5 block w-full rounded-xl bg-[#b99a58] px-5 py-3.5 text-center font-semibold text-[#12352c] hover:bg-[#c7ad75]"
          >
            {user.membershipStatus === "ACTIVE"
              ? "Open Wallet"
              : "View Wallet & Activate Membership"}
          </a>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-bold">My Referred Clients</h2>
          <p className="mt-2 text-sm leading-6 text-[#12352c]/65">
            Track registrations made through your referral link and view
            recorded referral rewards.
          </p>

          {referralError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-white p-4">
              <p role="alert" className="text-sm text-red-700">
                {referralError}
              </p>
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="mt-3 text-sm font-semibold underline"
              >
                Retry loading dashboard
              </button>
            </div>
          )}

          {!referrals && !referralError && (
            <div className="mt-5 rounded-2xl bg-white p-5">
              Loading your referred clients...
            </div>
          )}

          {referrals && (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">
                    All Referrals
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {referrals.total}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">Active</p>
                  <p className="mt-1 text-2xl font-bold">
                    {referrals.active}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">Pending</p>
                  <p className="mt-1 text-2xl font-bold">
                    {referrals.pending}
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4 ring-1 ring-[#12352c]/10">
                  <p className="text-sm text-[#12352c]/65">
                    Recorded Rewards
                  </p>
                  <p className="mt-1 break-words text-lg font-bold">
                    {money(totalRewards)}
                  </p>
                </div>
              </div>

              {referrals.clients.length === 0 ? (
                <div className="mt-5 rounded-2xl bg-white p-6 text-center ring-1 ring-[#12352c]/10">
                  <h3 className="font-bold">No referred clients yet</h3>
                  <p className="mt-2 text-sm leading-6 text-[#12352c]/65">
                    Share your referral link. Members who register through
                    it will appear here when their registrations are
                    recorded by Corevia Network.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {referrals.clients.map((client) => {
                    const status = (
                      client.membershipStatus || "PENDING"
                    ).toUpperCase();

                    const statusStyle =
                      status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800";

                    return (
                      <article
                        key={client.id}
                        className="rounded-2xl bg-white p-5 ring-1 ring-[#12352c]/10"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold">
                              {client.name || "Network Member"}
                            </h3>
                            <p className="mt-1 text-sm text-[#12352c]/65">
                              Registered: {formatDate(client.registeredAt)}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}
                          >
                            {status}
                          </span>
                        </div>

                        <div className="mt-4 grid gap-4 border-t border-[#12352c]/10 pt-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs text-[#12352c]/65">
                              Membership Payment Date
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {client.membershipPaidAt
                                ? formatDate(client.membershipPaidAt)
                                : "Not yet activated"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-[#12352c]/65">
                              Recorded Reward
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                              {money(Number(client.rewardEarned) || 0)}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>

        <footer className="mt-10 border-t border-[#12352c]/10 py-6 text-center text-xs text-[#12352c]/55">
          Corevia Network · Building Trust Through Excellence.
        </footer>
      </div>
    </main>
  );
}
