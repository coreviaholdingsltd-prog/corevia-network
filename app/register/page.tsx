import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-10 text-[#12352c]">
      <div className="mx-auto max-w-md">
        <Link
          href="/"
          className="text-sm font-semibold text-[#b99a58]"
        >
          ← Corevia Network
        </Link>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-[#12352c]/10">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
              Join Corevia Network
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#12352c]/65">
              Build your profile, connect with people and participate in
              legitimate business opportunities.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Full name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
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
                placeholder="07XX XXX XXX"
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
                placeholder="Create a password"
                className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Referral code{" "}
                <span className="font-normal text-[#12352c]/50">
                  (optional)
                </span>
              </label>

              <input
                type="text"
                name="referralCode"
                placeholder="Enter referral code"
                className="w-full rounded-xl border border-[#12352c]/15 bg-[#f7f5ef]/50 px-4 py-3 outline-none focus:border-[#b99a58]"
              />
            </div>

            <label className="flex gap-3 pt-1 text-sm leading-5 text-[#12352c]/70">
              <input type="checkbox" className="mt-1" />
              <span>
                I agree to the Corevia Network terms and understand that
                participation does not guarantee income or business results.
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#12352c] px-5 py-3.5 font-semibold text-white"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#12352c]/65">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#12352c] underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}