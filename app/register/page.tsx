
"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";

function RegisterForm() {
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState(() =>
    searchParams.get("ref")?.trim().toUpperCase() ?? ""
  );

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
          acceptTerms: data.get("terms") === "on",
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
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-5 py-10 text-[#12352c]">
      <div className="w-full max-w-md">
        <Link href="/" className="text-sm font-semibold text-[#b99a58]">
          ← Corevia Rise
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#12352c]/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
            Join Corevia Rise
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#12352c]/65">
            Create your Corevia Rise member profile and receive your
            unique referral code.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
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
                <label
                  htmlFor="register-name"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Full name
                </label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label
                  htmlFor="register-phone"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Phone number
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  name="phone"
                  placeholder="Optional — needed when requesting an M-PESA withdrawal"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
                />
              </div>

              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 pr-20 outline-none focus:border-[#b99a58]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-4 my-auto h-fit text-sm font-bold text-[#12352c] underline underline-offset-4"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Repeat your password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 pr-20 outline-none focus:border-[#b99a58]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-pressed={showConfirmPassword}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-4 my-auto h-fit text-sm font-bold text-[#12352c] underline underline-offset-4"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="register-referral"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Referral code
                </label>
                <input
                  id="register-referral"
                  type="text"
                  name="referralCode"
                  value={referralCode}
                  onChange={(event) =>
                    setReferralCode(event.target.value.toUpperCase())
                  }
                  placeholder="Optional"
                  autoComplete="off"
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
                  I have read and agree to the <Link href="/terms" className="font-semibold underline">Terms</Link> and <Link href="/privacy" className="font-semibold underline">Privacy Notice</Link>. I understand that registration creates a member account. My phone number is optional at registration and may be requested when needed for a withdrawal.
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

export default function Register() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-5 text-[#12352c]">
          <p className="text-sm font-medium">Loading registration...</p>
        </main>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
