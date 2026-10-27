"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

type Gig = {
  id: string; title: string; description: string; category: string; location: string | null;
  workMode: "REMOTE" | "HYBRID" | "ONSITE"; budgetKsh: number | null;
  budgetType: "FIXED" | "HOURLY" | "NEGOTIABLE"; deadline: string | null;
  createdAt: string; ownerName: string; applicationsCount: number;
};
type Member = { id: string; name: string; email: string; membershipStatus: string };
type Draft = { title: string; description: string; category: string; location: string; workMode: string; budgetKsh: string; budgetType: string; deadline: string };
const emptyDraft: Draft = { title: "", description: "", category: "Digital services", location: "", workMode: "REMOTE", budgetKsh: "", budgetType: "NEGOTIABLE", deadline: "" };
const categories = ["Digital services", "Design & media", "Office & admin", "Technology", "Writing & research", "Marketing & sales", "Business support", "Other"];
const money = (value: number | null, type: string) => value === null ? "Budget negotiable" : (type === "HOURLY" ? "KES " + value.toLocaleString("en-KE") + " / hour" : "KES " + value.toLocaleString("en-KE"));
const modeLabel = (mode: string) => mode === "ONSITE" ? "On-site" : mode === "HYBRID" ? "Hybrid" : "Remote";

export default function GigsClient() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [applyGig, setApplyGig] = useState<Gig | null>(null);
  const [proposal, setProposal] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const loadGigs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category !== "all") params.set("category", category);
      if (workMode !== "all") params.set("workMode", workMode);
      const response = await fetch("/api/gigs?" + params.toString(), { cache: "no-store" });
      const data = await response.json();
      if (!response.ok || data.status !== true || !Array.isArray(data.gigs)) throw new Error(data.error || "Unable to load gigs.");
      setGigs(data.gigs as Gig[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load gigs.");
    } finally { setLoading(false); }
  }, [query, category, workMode]);

  useEffect(() => { void loadGigs(); }, [loadGigs]);
  useEffect(() => {
    let alive = true;
    fetch("/api/auth/me", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return null;
      const data = await response.json();
      return data?.user as Member | undefined;
    }).then((account) => { if (alive && account?.id) setMember(account); }).catch(() => undefined);
    return () => { alive = false; };
  }, []);

  function updateDraft<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submitGig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/gigs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draft, budgetKsh: draft.budgetKsh ? Number(draft.budgetKsh) : null, deadline: draft.deadline || null }) });
      const data = await response.json();
      if (!response.ok || data.status !== true) throw new Error(data.error || "Unable to post gig.");
      setNotice(data.message || "Gig submitted for review."); setDraft(emptyDraft); setShowPost(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to post gig."); }
    finally { setBusy(false); }
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applyGig) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/gigs/" + encodeURIComponent(applyGig.id) + "/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposal, portfolioUrl }) });
      const data = await response.json();
      if (!response.ok || data.status !== true) throw new Error(data.error || "Unable to submit application.");
      setNotice(data.message || "Application submitted."); setApplyGig(null); setProposal(""); setPortfolioUrl("");
      await loadGigs();
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit application."); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
      <header className="border-b border-[#12352c]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link href="/" className="text-lg font-black tracking-tight">COREVIA RISE <span className="text-[#a88949]">/ GIGS</span></Link>
          <nav aria-label="Gigs navigation" className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link href="/opportunities" className="rounded-full border border-[#12352c]/15 px-4 py-2">Opportunities</Link>
            <Link href="/missions" className="rounded-full border border-[#12352c]/15 px-4 py-2">Skill missions</Link>
            <Link href="/academy" className="rounded-full border border-[#12352c]/15 px-4 py-2">Academy</Link>
            <Link href={member ? "/gigs/manage" : "/login"} className="rounded-full bg-[#12352c] px-4 py-2 text-white">My Gigs</Link>
          </nav>
        </div>
      </header>
      <section className="relative overflow-hidden bg-[#12352c] text-white">
        <div aria-hidden="true" className="absolute -right-20 -top-24 h-80 w-80 rounded-full border-[36px] border-[#d6bb7e]/15" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d6bb7e]">Real work. Practical proof.</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Turn your skills into useful work.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">Find small projects, show what you can do and connect with clients. Businesses can post work for review. Applying is free—Corevia Rise does not charge workers an application fee.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#available-gigs" className="rounded-full bg-[#d6bb7e] px-6 py-3 font-bold text-[#12352c]">Browse gigs</a>
            <button type="button" onClick={() => member ? setShowPost((value) => !value) : window.location.assign("/login")} className="rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Post a gig</button>
          </div>
          <p className="mt-5 text-xs leading-5 text-white/65">Corevia Rise currently connects people; it does not hold funds or process client payments. Agree scope, deliverables and payment terms clearly before starting work.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {notice && <p role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

        {showPost && member && (
          <section className="mb-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">For employers and clients</p><h2 className="mt-2 text-2xl font-black">Post a gig</h2><p className="mt-2 text-sm leading-6 text-[#12352c]/65">Listings are reviewed before becoming public. Write a clear scope and realistic budget. Do not ask applicants to pay fees.</p></div><button type="button" onClick={() => setShowPost(false)} className="rounded-full border px-4 py-2 text-sm font-semibold">Close</button></div>
            <form onSubmit={submitGig} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold">Gig title<input required minLength={5} maxLength={100} value={draft.title} onChange={(e) => updateDraft("title", e.target.value)} placeholder="Example: Design a 5-page business brochure" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
              <label className="grid gap-1 text-sm font-semibold">Category<select value={draft.category} onChange={(e) => updateDraft("category", e.target.value)} className="rounded-xl border border-[#12352c]/20 bg-white p-3 font-normal">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="grid gap-1 text-sm font-semibold">Work mode<select value={draft.workMode} onChange={(e) => updateDraft("workMode", e.target.value)} className="rounded-xl border border-[#12352c]/20 bg-white p-3 font-normal"><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></select></label>
              <label className="grid gap-1 text-sm font-semibold">Location (optional)<input maxLength={120} value={draft.location} onChange={(e) => updateDraft("location", e.target.value)} placeholder="Nairobi, Kenya or Remote" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
              <label className="grid gap-1 text-sm font-semibold">Budget type<select value={draft.budgetType} onChange={(e) => updateDraft("budgetType", e.target.value)} className="rounded-xl border border-[#12352c]/20 bg-white p-3 font-normal"><option value="NEGOTIABLE">Negotiable</option><option value="FIXED">Fixed price (KES)</option><option value="HOURLY">Hourly rate (KES)</option></select></label>
              <label className="grid gap-1 text-sm font-semibold">Budget / rate in KES (optional if negotiable)<input type="number" min="1" max="100000000" step="1" value={draft.budgetKsh} onChange={(e) => updateDraft("budgetKsh", e.target.value)} placeholder="e.g. 5000" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
              <label className="grid gap-1 text-sm font-semibold md:col-span-2">Deadline (optional)<input type="date" value={draft.deadline} onChange={(e) => updateDraft("deadline", e.target.value)} min={new Date().toISOString().slice(0,10)} className="rounded-xl border border-[#12352c]/20 p-3 font-normal md:max-w-xs" /></label>
              <label className="grid gap-1 text-sm font-semibold md:col-span-2">Scope and deliverables<textarea required minLength={40} maxLength={4000} rows={5} value={draft.description} onChange={(e) => updateDraft("description", e.target.value)} placeholder="Describe the task, expected deliverables, relevant skills and how the work will be reviewed." className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
              <div className="md:col-span-2"><button disabled={busy} className="rounded-xl bg-[#12352c] px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Submitting…" : "Submit gig for review"}</button></div>
            </form>
          </section>
        )}

        <section id="available-gigs">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">Browse</p><h2 className="mt-2 text-3xl font-black">Open gigs</h2><p className="mt-2 text-sm text-[#12352c]/65">Only approved listings appear here. Availability is not a promise of selection or earnings.</p></div><span className="rounded-full border border-[#12352c]/15 bg-white px-4 py-2 text-xs font-bold">{gigs.length} listed</span></div>
          <div className="mt-5 grid gap-3 rounded-2xl border border-[#12352c]/10 bg-white p-4 sm:grid-cols-[1fr_220px_170px]">
            <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[#12352c]/60">Search<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try Excel, design, writing…" className="rounded-xl border border-[#12352c]/15 p-3 text-sm font-normal normal-case tracking-normal text-[#12352c]" /></label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[#12352c]/60">Category<select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-[#12352c]/15 bg-white p-3 text-sm font-normal normal-case tracking-normal text-[#12352c]"><option value="all">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="grid gap-1 text-xs font-bold uppercase tracking-wide text-[#12352c]/60">Work mode<select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="rounded-xl border border-[#12352c]/15 bg-white p-3 text-sm font-normal normal-case tracking-normal text-[#12352c]"><option value="all">Any mode</option><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></select></label>
          </div>
          {loading ? <div className="mt-5 rounded-2xl bg-white p-8 text-center">Loading open gigs…</div> : gigs.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-[#12352c]/20 bg-white p-8 text-center"><h3 className="text-lg font-black">No approved gigs match yet.</h3><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#12352c]/65">Check again later or browse the public opportunity directory and build a sample project while Corevia reviews incoming listings.</p><Link href="/opportunities" className="mt-4 inline-flex rounded-full bg-[#12352c] px-5 py-3 text-sm font-bold text-white">Explore public opportunities</Link></div> : <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{gigs.map((gig) => <article key={gig.id} className="flex flex-col rounded-3xl border border-[#12352c]/10 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-[#f7f5ef] px-3 py-1.5 text-xs font-bold">{gig.category}</span><span className="text-xs text-[#12352c]/55">{modeLabel(gig.workMode)}</span></div><h3 className="mt-4 text-xl font-black">{gig.title}</h3><p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#12352c]/70">{gig.description}</p><div className="mt-4 space-y-1 text-sm"><p className="font-bold">{money(gig.budgetKsh, gig.budgetType)}</p>{gig.location && <p className="text-[#12352c]/60">Location: {gig.location}</p>}<p className="text-xs text-[#12352c]/55">Posted by {gig.ownerName} · {gig.applicationsCount} application{gig.applicationsCount === 1 ? "" : "s"}</p>{gig.deadline && <p className="text-xs text-[#12352c]/55">Deadline: {new Date(gig.deadline).toLocaleDateString("en-KE")}</p>}</div><div className="mt-auto pt-5"><button type="button" onClick={() => { if (!member) { window.location.assign("/login"); return; } setApplyGig(applyGig?.id === gig.id ? null : gig); setProposal(""); setPortfolioUrl(""); }} className="w-full rounded-xl bg-[#12352c] px-5 py-3 font-bold text-white">{member ? (applyGig?.id === gig.id ? "Cancel application" : "Apply for free") : "Sign in to apply"}</button>{applyGig?.id === gig.id && member && <form onSubmit={submitApplication} className="mt-4 grid gap-3 rounded-xl bg-[#f7f5ef] p-4"><label className="grid gap-1 text-xs font-bold">Why are you a good fit?<textarea required minLength={30} maxLength={2500} rows={5} value={proposal} onChange={(e) => setProposal(e.target.value)} placeholder="Describe your relevant skills, approach and what you would deliver." className="rounded-lg border border-[#12352c]/15 bg-white p-3 text-sm font-normal" /></label><label className="grid gap-1 text-xs font-bold">Portfolio link (optional)<input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://…" className="rounded-lg border border-[#12352c]/15 bg-white p-3 text-sm font-normal" /></label><button disabled={busy} className="rounded-lg bg-[#b99a58] px-4 py-3 text-sm font-black text-[#12352c] disabled:opacity-60">{busy ? "Submitting…" : "Submit application"}</button><p className="text-xs leading-5 text-[#12352c]/60">Applying is free. Never send money to secure an interview or a job.</p></form>}</div></article>)}</div>}
        </section>
      </div>
      <footer className="border-t border-[#12352c]/10 bg-white px-5 py-7 text-center text-xs text-[#12352c]/55"><p className="font-bold">COREVIA HOLDINGS LTD</p><p className="mt-1">Building Trust Through Excellence · Corevia Rise Gigs</p></footer>
    </main>
  );
}
