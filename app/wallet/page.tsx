
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

export default function Wallet() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [paying, setPaying] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [walletSummary, setWalletSummary] = useState<WalletSummary | null>(
    null,
  );
  const [walletSummaryLoading, setWalletSummaryLoading] = useState(false);
  const [walletSummaryError, setWalletSummaryError] = useState("");

  const [recipientCode, setRecipientCode] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [pendingTransfer, setPendingTransfer] =
    useState<PendingTransferDraft | null>(null);
  const [sendingTransfer, setSendingTransfer] = useState(false);
  const [transferMessage, setTransferMessage] = useState("");
  const [transferError, setTransferError] = useState("");

  const refreshUser = useCallback(async () => {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to refresh your account.");
    }

    setUser(result.user);
  }, []);

  const refreshWalletSummary = useCallback(async () => {
    const response = await fetch("/api/wallet/summary", {
      cache: "no-store",
    });

    const result =
      (await response.json()) as WalletSummaryResponse;

    if (!response.ok || result.status !== true) {
      throw new Error(
        result.error || "Unable to load your wallet information.",
      );
    }

    setWalletSummary({
      balance: Number(result.balance ?? 0),
      transactions: Array.isArray(result.transactions)
        ? result.transactions
        : [],
    });

    setWalletSummaryError("");
  }, []);

  async function verifyPayment(reference: string) {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Your payment could not be confirmed yet.",
      );
    }

    await refreshUser();

    setMessage(
      result.alreadyProcessed
        ? "Your membership payment was already processed. Your account status has been refreshed."
        : "Payment confirmed. Your membership status has been refreshed.",
    );

    return result;
  }

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setError(result.error || "Please sign in.");
          return;
        }

        setUser(result.user);
        setError("");
      } catch {
        if (!cancelled) {
          setError("Unable to load your account.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timer = window.setTimeout(() => {
      void loadUser();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const payment = new URLSearchParams(
      window.location.search,
    ).get("payment");

    if (!payment) return;

    let cancelled = false;

    async function verifyReturnedPayment() {
      setMessage("Confirming your payment...");
      setError("");

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: payment }),
          cache: "no-store",
        });

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setError(result.error || "Payment verification failed.");
          setMessage("");
          return;
        }

        setMessage(
          result.alreadyProcessed
            ? "Your membership payment was already processed."
            : "Payment confirmed. Your membership status has been updated.",
        );

        window.history.replaceState({}, "", "/wallet");

        const userResponse = await fetch("/api/auth/me", {
          cache: "no-store",
        });
        const userResult = await userResponse.json();

        if (!cancelled && userResponse.ok) {
          setUser(userResult.user);
        }
      } catch {
        if (!cancelled) {
          setError("Unable to verify your payment. Please try again.");
          setMessage("");
        }
      }
    }

    const timer = window.setTimeout(() => {
      void verifyReturnedPayment();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const storageKey =
      `corevia.wallet.transfer.pending.${user.id}`;

    try {
      const saved = window.sessionStorage.getItem(storageKey);

      if (!saved) return;

      const parsed = JSON.parse(saved) as Partial<PendingTransferDraft>;

      if (
        typeof parsed.recipientCode === "string" &&
        typeof parsed.amount === "string" &&
        typeof parsed.requestKey === "string" &&
        parsed.recipientCode.trim() !== "" &&
        parsed.amount.trim() !== "" &&
        parsed.requestKey.length >= 8 &&
        parsed.requestKey.length <= 128
      ) {
        const draft: PendingTransferDraft = {
          recipientCode: parsed.recipientCode,
          amount: parsed.amount,
          requestKey: parsed.requestKey,
        };

        setPendingTransfer(draft);
        setRecipientCode(draft.recipientCode);
        setTransferAmount(draft.amount);
        setTransferMessage(
          "A saved transfer attempt was found. Retry the same details to check its result.",
        );
      } else {
        setTransferError(
          "A saved transfer attempt could not be read safely. Do not start another transfer from this tab until the previous attempt is resolved.",
        );
      }
    } catch {
      setTransferError(
        "The saved transfer attempt could not be loaded safely. Do not start another transfer from this tab until the previous attempt is resolved.",
      );
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user || user.membershipStatus !== "ACTIVE") {
      setWalletSummary(null);
      setWalletSummaryLoading(false);
      return;
    }

    setWalletSummaryLoading(true);

    void refreshWalletSummary()
      .catch((err: unknown) => {
        setWalletSummaryError(
          errorMessage(err, "Unable to load wallet information."),
        );
      })
      .finally(() => {
        setWalletSummaryLoading(false);
      });
  }, [user?.id, user?.membershipStatus, refreshWalletSummary]);

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
        throw new Error(
          result.error || "Unable to start membership payment.",
        );
      }

      if (!result.authorization_url) {
        throw new Error(
          "Paystack did not return a payment link. Please try again.",
        );
      }

      window.location.href = result.authorization_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to Paystack.",
      );
      setPaying(false);
    }
  }

  async function checkPaidMembership() {
    setCheckingPayment(true);
    setError("");
    setMessage("");

    const reference = window.prompt(
      "Enter the Paystack reference from your payment receipt:",
    );

    if (!reference?.trim()) {
      setError("Payment reference is required.");
      setCheckingPayment(false);
      return;
    }

    try {
      await verifyPayment(reference.trim());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check your payment. Please try again.",
      );
      setMessage("");
    } finally {
      setCheckingPayment(false);
    }
  }

  async function submitTransfer() {
    if (!user || user.membershipStatus !== "ACTIVE") {
      setTransferError("An active membership is required to transfer funds.");
      return;
    }

    setTransferError("");
    setTransferMessage("");

    const normalizedCode = recipientCode.trim().toUpperCase();
    const amountText = transferAmount.trim();
    const amountNumber = Number(amountText);

    if (!normalizedCode || normalizedCode.length > 64) {
      setTransferError("Enter a valid recipient referral code.");
      return;
    }

    if (
      !/^\d+(?:\.\d{1,2})?$/.test(amountText) ||
      !Number.isFinite(amountNumber) ||
      amountNumber < 1
    ) {
      setTransferError(
        "Enter an amount of at least KES 1.00, using no more than two decimal places.",
      );
      return;
    }

    const amountCents = Math.round(amountNumber * 100);
    const storageKey =
      `corevia.wallet.transfer.pending.${user.id}`;

    let draft = pendingTransfer;

    if (draft) {
      const savedAmountCents = Math.round(Number(draft.amount) * 100);

      if (
        draft.recipientCode !== normalizedCode ||
        savedAmountCents !== amountCents
      ) {
        setTransferError(
          "A previous transfer attempt still needs confirmation. Keep the recipient and amount unchanged and retry that transfer before starting another.",
        );
        return;
      }
    } else {
      try {
        const existingSavedAttempt =
          window.sessionStorage.getItem(storageKey);

        if (existingSavedAttempt) {
          setTransferError(
            "A previous saved transfer attempt could not be safely matched. Do not initiate another transfer from this tab until it has been resolved.",
          );
          return;
        }
      } catch {
        setTransferError(
          "This browser cannot safely store a transfer retry key. The transfer was not submitted.",
        );
        return;
      }

      const requestKey =
        typeof window.crypto?.randomUUID === "function"
          ? window.crypto.randomUUID()
          : `cvr-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

      draft = {
        recipientCode: normalizedCode,
        amount: (amountCents / 100).toFixed(2),
        requestKey,
      };

      try {
        window.sessionStorage.setItem(
          storageKey,
          JSON.stringify(draft),
        );
      } catch {
        setTransferError(
          "Your transfer retry key could not be saved. The transfer was not submitted.",
        );
        return;
      }

      setPendingTransfer(draft);
    }

    setSendingTransfer(true);

    try {
      const response = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientCode: draft.recipientCode,
          amount: Number(draft.amount),
          requestKey: draft.requestKey,
        }),
        cache: "no-store",
      });

      const result = (await response.json()) as TransferResponse;

      if (!response.ok || result.status !== true) {
        setTransferError(
          result.error || "The transfer could not be confirmed.",
        );

        // These responses indicate validation or eligibility failures.
        // Preserve the key for authentication failures, conflicts,
        // server errors, and any uncertain outcome.
        if ([400, 403, 404, 422].includes(response.status)) {
          try {
            window.sessionStorage.removeItem(storageKey);
          } catch {
            // If storage cannot be cleared, future attempts stay blocked.
          }
          setPendingTransfer(null);
        }

        return;
      }

      // Clear the retry key only after the API confirms completion.
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // The completed transfer remains confirmed by the server.
      }

      setPendingTransfer(null);
      setRecipientCode("");
      setTransferAmount("");
      setTransferError("");

      const referenceText = result.reference
        ? ` Reference: ${result.reference}.`
        : "";

      const amountTextForMessage =
        typeof result.amount === "number"
          ? ` Recipient receives ${formatKES(result.amount)}.`
          : "";

      const feeText =
        typeof result.fee === "number"
          ? ` Transfer fee: ${formatKES(result.fee)}.`
          : "";

      const debitText =
        typeof result.totalDebited === "number"
          ? ` Total debited: ${formatKES(result.totalDebited)}.`
          : "";

      setTransferMessage(
        `${result.alreadyProcessed ? "This transfer was already completed." : "Transfer completed successfully."}${amountTextForMessage}${feeText}${debitText}${referenceText}`,
      );

      try {
        await refreshWalletSummary();
      } catch (err) {
        setWalletSummaryError(
          errorMessage(
            err,
            "Transfer completed, but the displayed wallet balance could not be refreshed.",
          ),
        );
      }
    } catch {
      setTransferError(
        "The transfer result could not be confirmed because the connection failed. Your attempt has been saved. Retry the same recipient and amount; do not start a new transfer yet.",
      );
    } finally {
      setSendingTransfer(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-3xl">
          <p>Loading your Corevia Rise wallet...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="mt-3 text-red-700">
            {error || "Please sign in."}
          </p>
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

  const amountTextIsValid =
    transferAmount.trim() !== "" &&
    /^\d+(?:\.\d{1,2})?$/.test(transferAmount.trim()) &&
    Number.isFinite(Number(transferAmount)) &&
    Number(transferAmount) >= 1;

  const previewAmountCents = amountTextIsValid
    ? Math.round(Number(transferAmount) * 100)
    : 0;

  const previewFeeCents = Math.round(previewAmountCents * 0.005);
  const previewTotalCents = previewAmountCents + previewFeeCents;

  return (
    <main className="min-h-screen bg-[#f7f5ef] p-4 text-[#12352c] sm:p-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
          Corevia Rise
        </p>

        <h1 className="mt-2 text-3xl font-bold">Wallet</h1>
        <p className="mt-2 text-sm text-[#12352c]/70">
          Manage your membership and member wallet transactions.
        </p>

        <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
          <p className="text-sm text-[#12352c]/60">
            Membership status
          </p>
          <p className="mt-2 text-2xl font-bold">
            {user.membershipStatus}
          </p>

          {active ? (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5">
              <h2 className="font-bold text-green-800">
                Membership Active
              </h2>
              <p className="mt-2 text-sm leading-6 text-green-700">
                Your membership is active. You can access your member
                dashboard and use the wallet transfer feature.
              </p>
              <div className="mt-4 w-full rounded-xl bg-green-700 px-5 py-3 text-center font-semibold text-white">
                ACTIVATED
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#b99a58]/30 bg-[#f7f5ef] p-5">
              <h2 className="text-xl font-bold">
                Activate Membership
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#12352c]/70">
                The one-time Corevia Rise activation fee is KES 1,000.
                If you have already paid, verify that payment before
                paying again.
              </p>

              <button
                type="button"
                onClick={activateMembership}
                disabled={busy}
                className="mt-5 w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {paying
                  ? "Opening Paystack..."
                  : "Pay KES 1,000 & Activate"}
              </button>

              <button
                type="button"
                onClick={checkPaidMembership}
                disabled={busy}
                className="mt-3 w-full rounded-xl border-2 border-[#b99a58] bg-white px-5 py-3.5 font-semibold text-[#12352c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingPayment
                  ? "Checking Payment..."
                  : "I've Paid - Activate My Account"}
              </button>
            </div>
          )}

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
        </section>

        {active && (
          <>
            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-[#12352c]/60">
                    Available wallet balance
                  </p>

                  {walletSummaryLoading ? (
                    <p className="mt-2 text-3xl font-bold">
                      Loading...
                    </p>
                  ) : (
                    <p className="mt-2 text-3xl font-bold">
                      {walletSummary
                        ? formatKES(walletSummary.balance)
                        : "KES --"}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setWalletSummaryLoading(true);
                    void refreshWalletSummary()
                      .catch((err: unknown) => {
                        setWalletSummaryError(
                          errorMessage(
                            err,
                            "Unable to refresh wallet information.",
                          ),
                        );
                      })
                      .finally(() => {
                        setWalletSummaryLoading(false);
                      });
                  }}
                  disabled={walletSummaryLoading}
                  className="rounded-xl border border-[#12352c]/20 px-4 py-2 text-sm font-semibold disabled:opacity-60"
                >
                  {walletSummaryLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              {walletSummaryError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {walletSummaryError}
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-[#12352c]/60">
                Your displayed balance is read from the wallet service.
                A transfer is only confirmed when the server returns a
                successful response.
              </p>
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
              <h2 className="text-xl font-bold">
                Send Money to a Member
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#12352c]/70">
                Enter the recipient's referral code and the amount
                they should receive. The 0.50% transfer fee is charged
                on top of the amount you send.
              </p>

              <form
                className="mt-5 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submitTransfer();
                }}
              >
                <div>
                  <label
                    htmlFor="recipientCode"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Recipient referral code
                  </label>
                  <input
                    id="recipientCode"
                    name="recipientCode"
                    type="text"
                    autoComplete="off"
                    maxLength={64}
                    placeholder="For example, CVC882507F"
                    value={recipientCode}
                    onChange={(event) =>
                      setRecipientCode(event.target.value.toUpperCase())
                    }
                    disabled={sendingTransfer || Boolean(pendingTransfer)}
                    required
                    className="w-full rounded-xl border border-[#12352c]/20 bg-white px-4 py-3 text-[#12352c] outline-none focus:border-[#b99a58] disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="transferAmount"
                    className="mb-2 block text-sm font-semibold"
                  >
                    Amount recipient receives (KES)
                  </label>
                  <input
                    id="transferAmount"
                    name="transferAmount"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="1000.00"
                    value={transferAmount}
                    onChange={(event) =>
                      setTransferAmount(event.target.value)
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
                    attempt is resolved.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={
                    sendingTransfer ||
                    !recipientCode.trim() ||
                    !transferAmount.trim()
                  }
                  className="w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sendingTransfer
                    ? "Processing Transfer..."
                    : pendingTransfer
                      ? "Retry Saved Transfer"
                      : "Send Transfer"}
                </button>
              </form>

              {transferMessage && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-800"
                >
                  {transferMessage}
                </div>
              )}

              {transferError && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {transferError}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">
                  Recent Wallet Transactions
                </h2>
                <span className="text-xs text-[#12352c]/60">
                  Latest 20
                </span>
              </div>

              {walletSummaryLoading && (
                <p className="mt-4 text-sm text-[#12352c]/70">
                  Loading transactions...
                </p>
              )}

              {!walletSummaryLoading &&
                walletSummary &&
                walletSummary.transactions.length === 0 && (
                  <p className="mt-4 text-sm text-[#12352c]/70">
                    No wallet transactions have been recorded yet.
                  </p>
                )}

              {!walletSummaryLoading &&
                walletSummary &&
                walletSummary.transactions.length > 0 && (
                  <div className="mt-4 divide-y divide-[#12352c]/10">
                    {walletSummary.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="py-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold">
                              {transaction.description ||
                                transactionLabel(transaction.type)}
                            </p>
                            <p className="mt-1 text-xs text-[#12352c]/60">
                              {new Date(
                                transaction.createdAt,
                              ).toLocaleString("en-KE")}
                            </p>
                            <p className="mt-1 break-all text-xs text-[#12352c]/60">
                              Ref: {transaction.reference}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold">
                              {`${["WALLET_TRANSFER_SENT", "WALLET_TRANSFER_FEE", "WITHDRAWAL", "WITHDRAWAL_FEE"].includes(transaction.type) ? "-" : transaction.type === "WALLET_TRANSFER_RECEIVED" ? "+" : ""}${formatKES(Math.abs(Number(transaction.amount)))}`}
                            </p>
                            <p
                              className={`mt-1 text-xs font-semibold ${
                                transaction.status === "COMPLETED"
                                  ? "text-green-700"
                                  : transaction.status === "FAILED"
                                    ? "text-red-700"
                                    : "text-amber-700"
                              }`}
                            >
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {!walletSummary && !walletSummaryLoading && (
                <p className="mt-4 text-sm text-[#12352c]/70">
                  Wallet information is not available. Use Refresh to try again.
                </p>
              )}
            </section>
          </>
        )}

        <a
          href="/dashboard"
          className="mt-6 block rounded-xl border border-[#12352c]/15 bg-white px-5 py-3 text-center text-sm font-semibold underline"
        >
          Back to Dashboard
        </a>
      </div>
    </main>
  );
}
