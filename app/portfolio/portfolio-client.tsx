"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

type PortfolioItem = {
  id: string;
  title: string;
  category: string | null;
  description: string;
  projectUrl: string | null;
  createdAt: string;
};
type Profile = {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  location: string | null;
  skills: string;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  isPublic: boolean;
  items: PortfolioItem[];
};
type ProfileForm = {
  headline: string;
  bio: string;
  location: string;
  skills: string;
  websiteUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  isPublic: boolean;
};
type ItemForm = { title: string; category: string; description: string; projectUrl: string };
const emptyProfile: ProfileForm = { headline: "", bio: "", location: "", skills: "", websiteUrl: "", linkedinUrl: "", githubUrl: "", isPublic: true };
const emptyItem: ItemForm = { title: "", category: "", description: "", projectUrl: "" };
const dateLabel = (value: string) => new Date(value).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" });

export default function PortfolioClient() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItem);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [publicUrl, setPublicUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [signedOut, setSignedOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyItem, setBusyItem] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError(""); setSignedOut(false);
    try {
      const response = await fetch("/api/portfolio", { cache: "no-store" });
      const result = await response.json();
      if (response.status === 401) { setSignedOut(true); return; }
      if (!response.ok || result.status !== true) throw new Error(result.error || "Unable to load your portfolio.");
      const current = result.profile as Profile | null;
      setProfile(current);
      setItems(current?.items || []);
      setPublicUrl(result.publicUrl || "");
      if (current) setForm({
        headline: current.headline || "", bio: current.bio || "", location: current.location || "",
        skills: current.skills || "", websiteUrl: current.websiteUrl || "", linkedinUrl: current.linkedinUrl || "",
        githubUrl: current.githubUrl || "", isPublic: current.isPublic,
      }); else setForm(emptyProfile);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to load your portfolio.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/portfolio", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok || result.status !== true) throw new Error(result.error || "Unable to save your profile.");
      setProfile(result.profile as Profile); setItems(result.profile.items || items); setPublicUrl(result.publicUrl || "");
      setNotice(result.message || "Portfolio profile saved.");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to save your profile."); }
    finally { setBusy(false); }
  }

  async function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusyItem("new"); setError(""); setNotice("");
    try {
      const response = await fetch("/api/portfolio/items", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(itemForm),
      });
      const result = await response.json();
      if (!response.ok || result.status !== true) throw new Error(result.error || "Unable to add project.");
      setItems((current) => [result.item as PortfolioItem, ...current]);
      setProfile((current) => current ? { ...current, items: [result.item as PortfolioItem, ...current.items] } : current);
      setItemForm(emptyItem); setNotice(result.message || "Project added.");
      await load();
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to add project."); }
    finally { setBusyItem(""); }
  }

  async function deleteItem(itemId: string) {
    if (!window.confirm("Remove this project from your portfolio?")) return;
    setBusyItem(itemId); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/portfolio/items/${encodeURIComponent(itemId)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || result.status !== true) throw new Error(result.error || "Unable to remove project.");
      setItems((current) => current.filter((item) => item.id !== itemId));
      setProfile((current) => current ? { ...current, items: current.items.filter((item) => item.id !== itemId) } : current);
      setNotice(result.message || "Project removed.");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to remove project."); }
    finally { setBusyItem(""); }
  }

  if (loading) return <main className="min-h-screen bg-[#f7f5ef] p-8 text-[#12352c]">Loading your portfolio…</main>;
  if (signedOut) return <main className="min-h-screen bg-[#f7f5ef] p-6 text-[#12352c]"><div className="mx-auto max-w-xl rounded-3xl bg-white p-7"><h1 className="text-2xl font-black">Sign in to build your portfolio</h1><p className="mt-2 text-sm leading-6 text-[#12352c]/65">Use your existing Corevia Network account. Your email and phone are not displayed on your public portfolio.</p><Link href="/login?next=%2Fportfolio" className="mt-5 inline-flex rounded-full bg-[#12352c] px-5 py-3 font-bold text-white">Sign in</Link></div></main>;

  return <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
    <header className="border-b border-[#12352c]/10 bg-white"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8"><Link href="/dashboard" className="text-lg font-black">COREVIA NETWORK <span className="text-[#a88949]">/ PORTFOLIO</span></Link><nav className="flex flex-wrap gap-2 text-sm font-semibold"><Link href="/dashboard" className="rounded-full border border-[#12352c]/15 px-4 py-2">Dashboard</Link><Link href="/gigs" className="rounded-full border border-[#12352c]/15 px-4 py-2">Browse Gigs</Link><Link href="/gigs/manage" className="rounded-full bg-[#12352c] px-4 py-2 text-white">My Gigs</Link></nav></div></header>
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a88949]">Show what you can do</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">My professional portfolio</h1><p className="mt-3 max-w-3xl leading-7 text-[#12352c]/70">Create an honest skills profile and add real work samples from courses, Skill Missions or client projects. A portfolio can help employers understand your work; it does not guarantee selection or income.</p>
      {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">{notice}</p>}{error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      <section className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-black">Your profile</h2><p className="mt-1 text-sm text-[#12352c]/60">Avoid adding private contact details to your bio.</p></div>{publicUrl && <Link href={publicUrl.replace("https://network.coreviaholdingltd.com", "")} target="_blank" className="rounded-full border border-[#12352c]/20 px-4 py-2 text-sm font-bold">View public profile ↗</Link>}</div>
        <form onSubmit={saveProfile} className="mt-5 grid gap-4 md:grid-cols-2"><label className="grid gap-1 text-sm font-semibold">Professional headline<input maxLength={100} value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Junior graphic designer | Canva and brand layouts" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Location (optional)<input maxLength={100} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Kisii, Kenya or Remote" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold md:col-span-2">About your work<textarea rows={4} maxLength={1200} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Explain the work you enjoy, the problems you can help solve and the type of projects you are ready to try." className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold md:col-span-2">Skills, comma separated<input maxLength={400} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="Excel, Canva, customer support, writing" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
          <label className="grid gap-1 text-sm font-semibold">Website (HTTPS)<input type="url" value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} placeholder="https://your-site.example" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">LinkedIn (HTTPS)<input type="url" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} placeholder="https://www.linkedin.com/in/…" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold md:col-span-2">GitHub / code profile (HTTPS)<input type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/…" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label>
          <label className="flex items-start gap-3 rounded-xl bg-[#f7f5ef] p-4 text-sm md:col-span-2"><input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="mt-1 h-4 w-4" /><span><strong>Make my portfolio public</strong><span className="mt-1 block text-[#12352c]/65">When enabled, anyone with your portfolio link can view your name, headline, bio, skills, links and published work samples. Your email, phone and referral data stay private.</span></span></label>
          <div className="md:col-span-2"><button disabled={busy} className="rounded-xl bg-[#12352c] px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? "Saving…" : "Save profile"}</button></div>
        </form>
      </section>
      <section className="mt-7 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-[#12352c]/10 sm:p-7"><h2 className="text-xl font-black">Work samples</h2><p className="mt-1 text-sm text-[#12352c]/60">Add work you created or have permission to share. Do not publish private client files or personal information.</p>
        <form onSubmit={addItem} className="mt-5 grid gap-4 md:grid-cols-2"><label className="grid gap-1 text-sm font-semibold">Project title<input required minLength={3} maxLength={100} value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} placeholder="e.g. Sample business flyer" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold">Category (optional)<input maxLength={80} value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })} placeholder="e.g. Design, spreadsheets, writing" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold md:col-span-2">What did you make and what does it demonstrate?<textarea required minLength={20} maxLength={1200} rows={3} value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} placeholder="Summarize your contribution, tools used and the result. Be specific and honest." className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><label className="grid gap-1 text-sm font-semibold md:col-span-2">Public project link (optional, HTTPS)<input type="url" value={itemForm.projectUrl} onChange={(e) => setItemForm({ ...itemForm, projectUrl: e.target.value })} placeholder="https://…" className="rounded-xl border border-[#12352c]/20 p-3 font-normal" /></label><div className="md:col-span-2"><button disabled={busyItem === "new"} className="rounded-xl bg-[#b99a58] px-6 py-3 font-bold text-[#12352c] disabled:opacity-60">{busyItem === "new" ? "Adding…" : "Add work sample"}</button></div></form>
        {items.length === 0 ? <div className="mt-6 rounded-2xl border border-dashed border-[#12352c]/20 p-7 text-center"><h3 className="font-bold">Your portfolio is ready for its first work sample.</h3><p className="mt-2 text-sm text-[#12352c]/65">Try completing a Skill Mission and documenting what you learned.</p><Link href="/missions" className="mt-4 inline-flex rounded-full bg-[#12352c] px-5 py-3 text-sm font-bold text-white">Open Skill Missions</Link></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-2xl border border-[#12352c]/10 bg-[#f7f5ef] p-5"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-[#a88949]">{item.category || "Work sample"}</p><h3 className="mt-2 text-lg font-black">{item.title}</h3></div><button type="button" disabled={busyItem === item.id} onClick={() => void deleteItem(item.id)} className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-800 disabled:opacity-50">{busyItem === item.id ? "Removing…" : "Remove"}</button></div><p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#12352c]/75">{item.description}</p>{item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold underline">Open work sample ↗</a>}<p className="mt-3 text-xs text-[#12352c]/50">Added {dateLabel(item.createdAt)}</p></article>)}</div>}
      </section>
      <p className="mt-7 text-xs leading-5 text-[#12352c]/55">Corevia Network does not independently certify the accuracy of user-submitted project claims. Share only work you own or have permission to display. Never include passwords, identity documents or private client information.</p>
    </div>
  </main>;
}
