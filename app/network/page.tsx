import Link from "next/link";

export default function Network() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c] sm:p-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-semibold underline underline-offset-4">
          Back to Corevia Rise
        </Link>

        <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-[#a88949]">
          Connect
        </p>

        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
          Corevia Rise Network
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#12352c]/75">
          Connect, refer, collaborate and grow. Corevia Rise Network brings
          member networking features together with tools for building
          connections and exploring opportunities.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-full bg-[#12352c] px-6 py-3 font-semibold text-white"
          >
            Join Corevia Rise
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-[#12352c]/20 px-6 py-3 font-semibold"
          >
            Member Dashboard
          </Link>
          <Link
            href="/academy"
            className="rounded-full border border-[#12352c]/20 px-6 py-3 font-semibold"
          >
            Rise Academy
          </Link>
        </div>

        <footer className="mt-16 border-t border-[#12352c]/10 pt-6 text-sm text-[#12352c]/60">
          COREVIA HOLDINGS LTD | Building Trust Through Excellence.
        </footer>
      </div>
    </main>
  );
}
