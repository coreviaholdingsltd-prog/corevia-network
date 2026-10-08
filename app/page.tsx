import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
      <header className="border-b border-[#12352c]/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <div>
            <div className="text-xl font-bold tracking-wide">COREVIA</div>
            <div className="text-xs tracking-[0.2em] text-[#12352c]/60">
              NETWORK
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-[#12352c]/15 px-5 py-2.5 text-sm font-semibold"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-full bg-[#12352c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Join Network
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#b99a58]">
            Corevia Network
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-6xl">
            Building a trusted network of people, businesses and opportunities.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#12352c]/70">
            Connect with people, discover opportunities, grow your network and
            participate in legitimate commercial activities through Corevia.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-[#12352c] px-7 py-3.5 font-semibold text-white"
            >
              Create Your Network Profile
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-[#12352c]/15 px-7 py-3.5 font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#12352c]/10 bg-white/50">
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-16 md:grid-cols-3">
          <div className="rounded-2xl border border-[#12352c]/10 p-6">
            <h2 className="text-xl font-bold">Your Network</h2>
            <p className="mt-3 leading-7 text-[#12352c]/65">
              Build and manage your personal network through a unique referral
              link and transparent member relationships.
            </p>
          </div>

          <div className="rounded-2xl border border-[#12352c]/10 p-6">
            <h2 className="text-xl font-bold">Real Opportunities</h2>
            <p className="mt-3 leading-7 text-[#12352c]/65">
              Connect referrals to genuine products, services and commercial
              activity rather than recruitment alone.
            </p>
          </div>

          <div className="rounded-2xl border border-[#12352c]/10 p-6">
            <h2 className="text-xl font-bold">Transparency</h2>
            <p className="mt-3 leading-7 text-[#12352c]/65">
              Keep member activity, network relationships and eligible rewards
              clear and traceable.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl bg-[#12352c] px-6 py-12 text-white sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b99a58]">
            Join Corevia Network
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Create your network profile today.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-white/70">
            Register as a Corevia Network member and receive your unique
            referral code for building your network.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-block rounded-full bg-[#b99a58] px-7 py-3.5 font-semibold text-[#12352c]"
          >
            Register Now
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#12352c]/10 px-5 py-8 text-center text-sm text-[#12352c]/60">
        COREVIA HOLDINGS LTD - Building Trust Through Excellence.
      </footer>
    </main>
  );
}