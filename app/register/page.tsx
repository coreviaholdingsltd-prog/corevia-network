"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function Register() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("ref");

    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          password,
          referralCode: referralCode.trim().toUpperCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to create account.");
        return;
      }

      setSuccess(
        `Account created successfully. Your referral code is ${result.user.referralCode}.`
      );
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-[#b99a58]">
          ← Corevia Network
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#12352c]/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
            Join Corevia Network
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#12352c]/65">
            Create your Corevia Network member profile and receive your
            unique referral code.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
              <Link
                href="/login"
                className="mt-3 block font-semibold underline"
              >
                Continue to Sign In
              </Link>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="07XXXXXXXX"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Referral code
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={referralCode}
                  onChange={(event) =>
                    setReferralCode(event.target.value.toUpperCase())
                  }
                  placeholder="Optional"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 uppercase outline-none focus:border-[#b99a58]"
                />
                <p className="mt-1.5 text-xs text-[#12352c]/55">
                  If you joined through a member&apos;s referral link, the
                  code has been filled in automatically.
                </p>
              </div>

              <label className="flex items-start gap-3 text-sm text-[#12352c]/70">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="mt-1"
                />
                <span>
                  I agree to the Corevia Network terms and understand that
                  registration creates a member account.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#12352c]/65">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#12352c] underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}