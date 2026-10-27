import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Member Portfolio | Corevia Network",
  description: "View a member's professional skills and public work samples on Corevia Network.",
};

type Props = { params: Promise<{ userId: string }> };

export default async function PublicPortfolioPage({ params }: Props) {
  const { userId } = await params;
  const profile = await prisma.memberProfile.findFirst({
    where: { userId, isPublic: true },
    select: {
      headline: true, bio: true, location: true, skills: true, websiteUrl: true,
      linkedinUrl: true, githubUrl: true, updatedAt: true,
      user: { select: { id: true, name: true } },
      items: { orderBy: { createdAt: "desc" }, take: 30, select: { id: true, title: true, category: true, description: true, projectUrl: true, createdAt: true } },
    },
  });
  if (!profile) notFound();
  const skills = profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 30);
  const externalLinks = [
    profile.websiteUrl ? { label: "Website", url: profile.websiteUrl } : null,
    profile.linkedinUrl ? { label: "LinkedIn", url: profile.linkedinUrl } : null,
    profile.githubUrl ? { label: "GitHub", url: profile.githubUrl } : null,
  ].filter((link): link is { label: string; url: string } => Boolean(link));

  return <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
    <header className="border-b border-[#12352c]/10 bg-white"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"><Link href="/" className="text-lg font-black">COREVIA NETWORK <span className="text-[#a88949]">/ PORTFOLIO</span></Link><nav className="flex flex-wrap gap-2 text-sm font-semibold"><Link href="/gigs" className="rounded-full border border-[#12352c]/15 px-4 py-2">Browse Gigs</Link><Link href="/login" className="rounded-full bg-[#12352c] px-4 py-2 text-white">Join Corevia Network</Link></nav></div></header>
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"><section className="rounded-3xl bg-[#12352c] p-7 text-white sm:p-10"><p className="text-xs font-black uppercase tracking-[0.22em] text-[#d6bb7e]">Member portfolio</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">{profile.user.name}</h1>{profile.headline && <p className="mt-3 text-lg font-semibold text-white/85">{profile.headline}</p>}{profile.location && <p className="mt-2 text-sm text-white/65">{profile.location}</p>}{profile.bio && <p className="mt-6 max-w-3xl whitespace-pre-line leading-7 text-white/80">{profile.bio}</p>}<p className="mt-6 text-xs text-white/55">Profile updated {profile.updatedAt.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</p></section>
      {skills.length > 0 && <section className="mt-7 rounded-3xl bg-white p-6 ring-1 ring-[#12352c]/10 sm:p-8"><h2 className="text-xl font-black">Skills</h2><div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill} className="rounded-full bg-[#f7f5ef] px-4 py-2 text-sm font-semibold">{skill}</span>)}</div></section>}
      {externalLinks.length > 0 && <section className="mt-7 rounded-3xl bg-white p-6 ring-1 ring-[#12352c]/10 sm:p-8"><h2 className="text-xl font-black">Professional links</h2><div className="mt-4 flex flex-wrap gap-3">{externalLinks.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#12352c]/20 px-4 py-2 text-sm font-bold underline underline-offset-4">{link.label} ↗</a>)}</div></section>}
      <section className="mt-7"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">Proof of practice</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">Work samples</h2></div><span className="rounded-full border border-[#12352c]/15 bg-white px-4 py-2 text-xs font-bold">{profile.items.length} project{profile.items.length === 1 ? "" : "s"}</span></div>{profile.items.length === 0 ? <div className="mt-4 rounded-2xl bg-white p-7 text-sm text-[#12352c]/65">This member has not published any work samples yet.</div> : <div className="mt-4 grid gap-4 md:grid-cols-2">{profile.items.map((item) => <article key={item.id} className="rounded-2xl bg-white p-6 ring-1 ring-[#12352c]/10"><p className="text-xs font-black uppercase tracking-wide text-[#a88949]">{item.category || "Work sample"}</p><h3 className="mt-2 text-xl font-black">{item.title}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#12352c]/75">{item.description}</p>{item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex text-sm font-bold underline underline-offset-4">View project ↗</a>}<p className="mt-4 text-xs text-[#12352c]/45">Added {item.createdAt.toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}</p></article>)}</div>}</section>
      <p className="mt-8 text-xs leading-5 text-[#12352c]/55">This portfolio is published by its member. COREVIA HOLDINGS LTD does not independently certify user-submitted project claims. Confirm scope, terms and ownership before engaging.</p>
    </div>
  </main>;
}
