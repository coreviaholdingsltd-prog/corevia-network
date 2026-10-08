"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to sign in.");
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-[#b99a58]"
        >
          ← Corevia Network
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#12352c]/10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
            Member Login
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Welcome back
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#12352c]/65">
            Sign in to access your Corevia Network member account.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#12352c]/65">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#12352c] underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}