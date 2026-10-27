import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opportunities | Corevia Rise",
  description:
    "Explore official jobs, digital work training, youth programmes and enterprise support from Corevia Rise.",
};

const officialChannels = [
  {
    name: "National Employment Authority (NEAIMS)",
    category: "Jobs in Kenya",
    summary:
      "Search the National Employment Authority's employment system and review listings from employers and agencies.",
    detail: "Jobs and recruitment",
    href: "https://recruitment.neaims.go.ke/",
    action: "Browse job listings",
    tone: "blue",
  },
  {
    name: "Ajira Digital",
    category: "Digital work",
    summary:
      "Explore digital-work opportunities, online training and support for building practical skills for online work.",
    detail: "Online work and training",
    href: "https://ajiradigital.go.ke/",
    action: "Explore digital work",
    tone: "violet",
  },
  {
    name: "NYOTA Project",
    category: "Youth programmes",
    summary:
      "Check official updates about youth employability, apprenticeships, entrepreneurship support and savings initiatives.",
    detail: "Government youth programme",
    href: "https://www.nyotaproject.go.ke/",
    action: "Check programme updates",
    tone: "green",
  },
  {
    name: "Youth Enterprise Development Fund",
    category: "Business support",
    summary:
      "Explore business development support, market linkages and youth enterprise financing. Read each facility's terms carefully.",
    detail: "Enterprise support and financing",
    href: "https://www.youthfund.go.ke/",
    action: "Explore business support",
    tone: "gold",
  },
  {
    name: "Kenya Labour Market Information System",
    category: "Career guidance",
    summary:
      "Use official labour-market information to discover youth initiatives, employment resources and skills pathways.",
    detail: "Career and labour-market information",
    href: "https://www.labourmarket.go.ke/youth-initiatives/",
    action: "Explore youth initiatives",
    tone: "teal",
  },
];

const filters = [
  { label: "All pathways", value: "all" },
  { label: "Jobs in Kenya", value: "Jobs in Kenya" },
  { label: "Digital work", value: "Digital work" },
  { label: "Youth programmes", value: "Youth programmes" },
  { label: "Business support", value: "Business support" },
  { label: "Career guidance", value: "Career guidance" },
];

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-sm font-bold text-[#12352c] underline decoration-[#b99a58] decoration-2 underline-offset-4 hover:text-[#8a6c2f] focus:outline-none focus:ring-2 focus:ring-[#b99a58] focus:ring-offset-4"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

type CoreviaOpportunity = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  createdAt: Date;
};

async function getCoreviaOpportunities(): Promise<CoreviaOpportunity[]> {
  try {
    return await prisma.opportunity.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        location: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Unable to load Corevia opportunity listings:", error);
    return [];
  }
}

export default async function OpportunitiesPage() {
  const coreviaOpportunities = await getCoreviaOpportunities();

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
      <header className="border-b border-[#12352c]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link href="/" className="text-lg font-black tracking-tight">
            COREVIA RISE <span className="text-[#a88949]">/ OPPORTUNITIES</span>
          </Link>
          <nav aria-label="Opportunity navigation" className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link href="/academy" className="rounded-full border border-[#12352c]/15 px-4 py-2 hover:bg-[#f7f5ef]">Academy</Link>
            <Link href="/missions" className="rounded-full border border-[#12352c]/15 px-4 py-2 hover:bg-[#f7f5ef]">Skill missions</Link>
            <Link href="/register" className="rounded-full bg-[#12352c] px-4 py-2 text-white hover:bg-[#1b493c]">Join Corevia Rise</Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#12352c] text-white">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[36px] border-[#d6bb7e]/15" />
        <div aria-hidden="true" className="absolute -bottom-40 right-24 h-80 w-80 rounded-full bg-[#d6bb7e]/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d6bb7e]">Find your next step</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Your next opportunity should be easier to find.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
            Discover official job portals, digital-work programmes and business-support resources. Then build practical proof of your skills with Corevia Rise Academy and Skill Missions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#official-channels" className="rounded-full bg-[#d6bb7e] px-6 py-3 font-bold text-[#12352c] hover:bg-[#e5d1a2]">Explore opportunity channels</a>
            <Link href="/missions" className="rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Start a free skill mission</Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
            <span>✓ Browse without signing in</span>
            <span>✓ Official external sources</span>
            <span>✓ No promise of guaranteed work</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-5">
            <p className="text-sm font-bold text-[#a88949]">01 / DISCOVER</p>
            <h2 className="mt-2 text-xl font-extrabold">Find real channels</h2>
            <p className="mt-2 text-sm leading-6 text-[#12352c]/70">Go directly to recognised public portals and check the current eligibility, application windows and deadlines.</p>
          </article>
          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-5">
            <p className="text-sm font-bold text-[#a88949]">02 / PREPARE</p>
            <h2 className="mt-2 text-xl font-extrabold">Build practical proof</h2>
            <p className="mt-2 text-sm leading-6 text-[#12352c]/70">Create a CV, spreadsheet, presentation or technical checklist you can show when applying for work.</p>
          </article>
          <article className="rounded-2xl border border-[#12352c]/10 bg-white p-5">
            <p className="text-sm font-bold text-[#a88949]">03 / FOLLOW THROUGH</p>
            <h2 className="mt-2 text-xl font-extrabold">Keep your progress</h2>
            <p className="mt-2 text-sm leading-6 text-[#12352c]/70">Track your practice missions on this device and download a portfolio summary to share with a potential client or employer.</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8 sm:pb-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a88949]">Corevia board</p>
            <h2 className="mt-2 text-3xl font-black">Opportunities listed on Corevia Rise</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#12352c]/70">Browse active posts published on the Corevia board. Confirm all terms with the organisation responsible before committing time or money.</p>
          </div>
          <span className="rounded-full border border-[#12352c]/15 bg-white px-4 py-2 text-xs font-bold">{coreviaOpportunities.length} active {coreviaOpportunities.length === 1 ? "listing" : "listings"}</span>
        </div>
        {coreviaOpportunities.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-[#12352c]/20 bg-white p-6">
            <h3 className="font-extrabold">No Corevia-posted listings are available right now.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#12352c]/70">We won't invent vacancies or pretend an opportunity is open. Use the official resources below while Corevia builds its own vetted listing pipeline.</p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {coreviaOpportunities.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[#12352c]/10 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-[#f7f5ef] px-3 py-1.5 text-xs font-bold">{item.category}</span>
                  <span className="text-xs text-[#12352c]/50">Posted {item.createdAt.toLocaleDateString("en-KE")}</span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold">{item.title}</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#12352c]/70">{item.description}</p>
                {item.location && <p className="mt-3 text-sm font-semibold text-[#12352c]/60">Location: {item.location}</p>}
                <a href={"mailto:coreviaholdingsltd@gmail.com?subject=" + encodeURIComponent("Opportunity enquiry: " + item.title)} className="mt-5 inline-flex font-bold text-sm underline decoration-[#b99a58] decoration-2 underline-offset-4">Enquire with Corevia ↗</a>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="official-channels" className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 sm:pb-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a88949]">Public resource directory</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Official opportunity channels</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#12352c]/70">These links go to the external organisations. Their listings, eligibility rules and application periods can change, so confirm the latest information on the official website.</p>
          </div>
          <span className="rounded-full border border-[#12352c]/15 bg-white px-4 py-2 text-xs font-bold">5 starting points</span>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {officialChannels.map((channel, index) => (
            <article key={channel.name} className="flex min-h-64 flex-col rounded-3xl border border-[#12352c]/10 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-[#f7f5ef] px-3 py-1.5 text-xs font-bold text-[#12352c]/75">{channel.category}</span>
                <span aria-hidden="true" className="text-sm font-black text-[#b99a58]">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold leading-snug">{channel.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[#12352c]/70">{channel.summary}</p>
              <div className="mt-5 border-t border-[#12352c]/10 pt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#12352c]/50">{channel.detail}</p>
                <ExternalLink href={channel.href}>{channel.action}</ExternalLink>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#12352c]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a88949]">Turn learning into evidence</p>
            <h2 className="mt-3 text-3xl font-black">Don’t just say you have a skill. Show what you can do.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-[#12352c]/70">Build small, honest work samples with the free-to-start Skill Missions. Download your portfolio summary and decide what to improve next.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/missions" className="rounded-full bg-[#12352c] px-6 py-3 font-bold text-white hover:bg-[#1b493c]">Build my portfolio</Link>
              <Link href="/academy" className="rounded-full border border-[#12352c]/20 px-6 py-3 font-bold hover:bg-[#f7f5ef]">Explore Academy</Link>
            </div>
          </div>
          <aside className="rounded-3xl bg-[#f7f5ef] p-6 sm:p-8">
            <h3 className="text-lg font-extrabold">Stay safe while searching</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#12352c]/75">
              <li>• Corevia will not charge you to view this directory or to unlock a job listing.</li>
              <li>• Verify the employer and the application page before sharing sensitive information.</li>
              <li>• Do not pay a recruiter who promises guaranteed employment or guaranteed earnings.</li>
              <li>• Membership activation and Academy course fees are separate from external applications and never guarantee a job or income.</li>
            </ul>
          </aside>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-7 text-sm text-[#12352c]/60 sm:px-8">
        <span>COREVIA HOLDINGS LTD · Building Trust Through Excellence.</span>
        <Link href="/" className="font-bold underline underline-offset-4">Back to Corevia Rise</Link>
      </footer>
    </main>
  );
}
