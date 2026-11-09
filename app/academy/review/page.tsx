"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

type Submission = {
  id: string; courseId: string; courseTitle: string; learner: string; learnerEmail: string;
  projectTitle: string; objective: string; methodology: string; workDescription: string;
  reflection: string; evidenceUrls: string[]; status: string;
};
const dimensions = [
  ["subjectKnowledge", "Subject knowledge and accuracy"],
  ["application", "Application and method"],
  ["evidenceAndMethod", "Evidence and source quality"],
  ["ethicsAndSafety", "Ethics and safety"],
  ["communication", "Communication and reflection"],
] as const;

export default function AcademyReviewPage() {
  const [items, setItems] = useState<Submission[]>([]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [decision, setDecision] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/academy/reviewer/projects", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Reviewer access unavailable.");
    setItems(data.submissions || []);
  }, []);

  useEffect(() => { void refresh().catch((issue) => setError(issue instanceof Error ? issue.message : "Unable to load reviewer queue.")); }, [refresh]);

  function setScore(id: string, key: string, value: number) {
    setScores((current) => ({ ...current, [id]: { ...(current[id] || {}), [key]: Math.max(0, Math.min(20, value)) } }));
  }

  async function review(event: FormEvent<HTMLFormElement>, item: Submission) {
    event.preventDefault();
    setBusy(item.id); setError(""); setNotice("");
    try {
      const rubricScores = Object.fromEntries(dimensions.map(([key]) => [key, scores[item.id]?.[key] ?? 0]));
      const response = await fetch("/api/academy/reviewer/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: item.id, rubricScores, feedback: feedback[item.id] || "", decision: decision[item.id] || "REVISION_REQUIRED" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to record review.");
      setNotice(data.message || "Review recorded.");
      await refresh();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to record review.");
    } finally { setBusy(""); }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><span className="font-bold">COREVIA ACADEMY · REVIEW DESK</span><div className="flex gap-2"><Link href="/academy/review/standards" className="rounded-lg border border-cyan-300/40 px-4 py-2 text-sm text-cyan-200">References & sign-off</Link><Link href="/academy" className="rounded-lg border border-white/20 px-4 py-2 text-sm">Academy</Link></div></div></header>
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        <section><p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Academic governance</p><h1 className="mt-2 text-3xl font-black">Practical project review queue</h1><p className="mt-3 max-w-3xl leading-7 text-slate-300">Review the learner's submitted work against the five Corevia criteria. Each criterion is scored from 0 to 20. Approval requires at least 75/100 and detailed written feedback. Review access is restricted to configured reviewer accounts.</p></section>
        {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-4 text-emerald-200">{notice}</p>}
        <div className="flex justify-end"><button onClick={() => void refresh().catch((e) => setError(e.message))} className="rounded-lg border border-white/20 px-4 py-2 text-sm">Refresh queue</button></div>
        {items.length === 0 ? <p className="rounded-xl border border-white/10 p-5 text-slate-400">No practical projects are awaiting review.</p> : items.map((item) => (
          <article key={item.id} className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
            <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">{item.projectTitle}</h2><p className="mt-1 text-sm text-slate-400">{item.courseTitle} · {item.learner} ({item.learnerEmail})</p></div><span className="h-fit rounded-full border border-white/20 px-3 py-1 text-xs">{item.status.replaceAll("_", " ")}</span></div>
            <div className="grid gap-4 text-sm leading-6">
              <section><h3 className="font-bold text-cyan-200">Objective</h3><p className="whitespace-pre-wrap text-slate-300">{item.objective}</p></section>
              <section><h3 className="font-bold text-cyan-200">Methodology</h3><p className="whitespace-pre-wrap text-slate-300">{item.methodology}</p></section>
              <section><h3 className="font-bold text-cyan-200">Work and findings</h3><p className="whitespace-pre-wrap text-slate-300">{item.workDescription}</p></section>
              <section><h3 className="font-bold text-cyan-200">Reflection</h3><p className="whitespace-pre-wrap text-slate-300">{item.reflection}</p></section>
              {item.evidenceUrls.length > 0 && <section><h3 className="font-bold text-cyan-200">Evidence</h3><ul className="list-inside list-disc">{item.evidenceUrls.map((url) => <li key={url}><a className="text-cyan-300 underline" href={url} target="_blank" rel="noreferrer">{url}</a></li>)}</ul></section>}
            </div>
            <form onSubmit={(event) => void review(event, item)} className="grid gap-4 border-t border-white/10 pt-5">
              <h3 className="font-bold">Assessment rubric · 100 points</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {dimensions.map(([key, label]) => <label key={key} className="grid gap-2 text-sm font-semibold">{label} (0–20)<input type="number" min={0} max={20} required value={scores[item.id]?.[key] ?? 0} onChange={(event) => setScore(item.id, key, Number(event.target.value))} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-2" /></label>)}
              </div>
              <label className="grid gap-2 text-sm font-semibold">Detailed feedback<textarea minLength={40} required rows={5} value={feedback[item.id] || ""} onChange={(event) => setFeedback((current) => ({ ...current, [item.id]: event.target.value }))} className="rounded-xl border border-white/15 bg-slate-900 px-4 py-3" placeholder="Explain strengths, shortcomings, evidence, corrections and next steps." /></label>
              <label className="grid gap-2 text-sm font-semibold">Decision<select value={decision[item.id] || "REVISION_REQUIRED"} onChange={(event) => setDecision((current) => ({ ...current, [item.id]: event.target.value }))} className="rounded-lg border border-white/15 bg-slate-900 px-3 py-3"><option value="REVISION_REQUIRED">Revision required</option><option value="APPROVED">Approve (75+ required)</option><option value="REJECTED">Reject</option></select></label>
              <button disabled={busy === item.id} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{busy === item.id ? "Saving review..." : "Record academic review"}</button>
            </form>
          </article>
        ))}
      </div>
    </main>
  );
}
