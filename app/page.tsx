import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
      <header className="border-b border-[#12352c]/10 bg-white/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/corevia-logo.png"
              alt="COREVIA HOLDINGS LTD official logo"
              width={609}
              height={409}
              priority
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="text-xl font-bold tracking-wide">
                COREVIA RISE
              </div>
              <div className="text-xs font-semibold tracking-[0.15em] text-[#12352c]/60">
                LEARN. CONNECT. GROW.
              </div>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-3">
            <Link
              href="/network"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Network
            </Link>
            <Link
              href="/academy"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Rise Academy
            </Link>
            <Link
              href="/opportunities"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Opportunities
            </Link>
            <Link
              href="/missions"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Skill Missions
            </Link>
            <Link
              href="/gigs"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Rise Gigs
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-[#12352c]/15 px-4 py-2.5 text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#12352c] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Join Corevia Rise
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-20 pt-20 sm:pb-28 sm:pt-28">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#a88949]">
            COREVIA HOLDINGS LTD PRESENTS
          </p>

          <h1 className="text-5xl font-bold leading-tight sm:text-7xl">
            Learn. Connect. Grow.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#12352c]/75 sm:text-xl">
            Welcome to Corevia Rise, a connected digital platform bringing
            together online learning, member networking and opportunity
            discovery to support your personal and professional growth.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-full bg-[#12352c] px-7 py-3.5 font-semibold text-white"
            >
              Start Your Journey
            </Link>
            <Link
              href="/academy"
              className="rounded-full border border-[#12352c]/20 px-7 py-3.5 font-semibold"
            >
              Explore Rise Academy
            </Link>
          </div>

          <p className="mt-5 text-sm text-[#12352c]/60">
            One platform. Two connected systems. A pathway to growth.
          </p>
        </div>
      </section>

      <section className="border-y border-[#12352c]/10 bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a88949]">
              Connect
            </p>
            <h2 className="mt-3 text-2xl font-bold">Corevia Rise Network</h2>
            <p className="mt-3 leading-7 text-[#12352c]/70">
              Build connections, manage your member network, use referral
              features and explore opportunities for collaboration.
            </p>
            <Link
              href="/network"
              className="mt-5 inline-block font-semibold underline underline-offset-4"
            >
              Explore Network
            </Link>
          </article>

          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a88949]">
              Learn
            </p>
            <h2 className="mt-3 text-2xl font-bold">Corevia Rise Academy</h2>
            <p className="mt-3 leading-7 text-[#12352c]/70">
              Explore structured courses, study lessons, complete assessments
              and earn course-completion certificates after meeting the
              required standards.
            </p>
            <Link
              href="/academy"
              className="mt-5 inline-block font-semibold underline underline-offset-4"
            >
              Explore Academy
            </Link>
          </article>

          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a88949]">
              Discover
            </p>
            <h2 className="mt-3 text-2xl font-bold">Opportunities</h2>
            <p className="mt-3 leading-7 text-[#12352c]/70">
              Discover the platform's opportunity features and learn more
              about participating in relevant commercial activities.
            </p>
            <Link
              href="/opportunities"
              className="mt-5 inline-block font-semibold underline underline-offset-4"
            >
              View Opportunities
            </Link>
          </article>

          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-7">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#a88949]">
              Build
            </p>
            <h2 className="mt-3 text-2xl font-bold">Skill Missions</h2>
            <p className="mt-3 leading-7 text-[#12352c]/70">
              Try practical starter projects, keep real work samples and download a simple portfolio summary.
            </p>
            <Link
              href="/missions"
              className="mt-5 inline-block font-semibold underline underline-offset-4"
            >
              Build My Portfolio
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-3xl bg-[#12352c] px-6 py-12 text-white sm:px-12 sm:py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6bb7e]">
            Your Next Level Starts Here
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Take your next step with Corevia Rise.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-white/80">
            Create your profile, explore the platform and choose the
            learning and networking features that fit your goals.
          </p>

          <Link
            href="/register"
            className="mt-7 inline-block rounded-full bg-[#d6bb7e] px-7 py-3.5 font-bold text-[#12352c]"
          >
            Join Corevia Rise
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#12352c]/10 px-5 py-8 text-center text-sm text-[#12352c]/65">
        <p className="font-semibold">COREVIA HOLDINGS LTD</p>
        <p className="mt-1">Building Trust Through Excellence.</p>
        <p className="mt-1">Corevia Rise | Learn. Connect. Grow.</p>
      </footer>
    </main>
  );
}
