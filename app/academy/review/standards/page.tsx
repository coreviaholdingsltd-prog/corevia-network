"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

type Course = { id: string; title: string; enrolled: boolean; isProgrammeStage?: boolean; programmeLevel?: string | null };
const criteriaLabels = [
  ["subjectAccuracy", "Subject accuracy and factual reliability"],
  ["learningOutcomes", "Clear, measurable learning outcomes"],
  ["sourceQuality", "Verified and appropriate source quality"],
  ["assessmentValidity", "Valid subject-specific assessment"],
  ["practicalRelevance", "Relevant practical application"],
  ["ethicsAndSafety", "Ethics, safeguarding and professional safety"],
  ["levelAppropriateness", "Appropriate academic level and progression"],
  ["accessibility", "Accessibility, clarity and inclusive learning"],
] as const;
const input = "w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white";

export default function AcademyStandardsReviewPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [publication, setPublication] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [sourceType, setSourceType] = useState("BOOK");
  const [url, setUrl] = useState("");
  const [doi, setDoi] = useState("");
  const [verificationNotes, setVerificationNotes] = useState("");
  const [criteria, setCriteria] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState("REVISION_REQUIRED");
  const [verifiedSources, setVerifiedSources] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/academy/courses", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to load courses.");
    const published = (data.courses || []) as Course[];
    setCourses(published);
    setCourseId((current) => current || published[0]?.id || "");
  }, []);

  useEffect(() => { void refresh().catch((issue) => setError(issue.message)); }, [refresh]);

  async function addReference(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/academy/reviewer/references", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, title, authors, publication, publicationYear: publicationYear ? Number(publicationYear) : null, sourceType, url, doi, verificationNotes }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to verify reference.");
      setNotice("Verified subject reference recorded. Add at least three credible references before academic approval.");
      setTitle(""); setAuthors(""); setPublication(""); setPublicationYear(""); setUrl(""); setDoi(""); setVerificationNotes("");
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to save reference."); }
    finally { setBusy(false); }
  }

  async function signoff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/academy/reviewer/signoffs", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, criteria, notes, decision }),
      });
      const data = await response.json();
      if (!response.ok) { setVerifiedSources(data.verifiedSources ?? verifiedSources); throw new Error(data.error || "Unable to record sign-off."); }
      setVerifiedSources(data.verifiedSources ?? verifiedSources);
      setNotice("Academic sign-off recorded with an auditable reviewer identity and timestamp.");
      setNotes(""); setCriteria({});
    } catch (issue) { setError(issue instanceof Error ? issue.message : "Unable to record sign-off."); }
    finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5"><span className="font-bold">COREVIA ACADEMY · STANDARDS REVIEW</span><Link href="/academy/review" className="rounded-lg border border-white/20 px-4 py-2 text-sm">Review queue</Link></div></header>
      <div className="mx-auto max-w-5xl space-y-7 px-5 py-10">
        <section><p className="text-sm font-bold uppercase tracking-widest text-cyan-300">Quality assurance</p><h1 className="mt-2 text-3xl font-black">References and academic sign-off</h1><p className="mt-3 leading-7 text-slate-300">Record real, traceable sources and document a course-stage review. Approval is blocked unless all eight criteria pass and at least three references have been independently verified for the selected course and stage. Never invent a citation or approve a source you have not checked.</p></section>
        {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-4 text-emerald-200">{notice}</p>}
        <label className="grid gap-2 text-sm font-semibold">Course / programme stage<select className={input} value={courseId} onChange={(event) => setCourseId(event.target.value)}>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Add a verified academic source</h2>
          <form onSubmit={addReference} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold">Source title<input required minLength={4} maxLength={300} className={input} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
            <label className="grid gap-2 text-sm font-semibold">Author(s) / issuing body<input required className={input} value={authors} onChange={(e) => setAuthors(e.target.value)} /></label>
            <label className="grid gap-2 text-sm font-semibold">Publisher / journal / issuing organisation<input required className={input} value={publication} onChange={(e) => setPublication(e.target.value)} /></label>
            <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-semibold">Publication year<input type="number" min="1450" max={new Date().getFullYear()+1} className={input} value={publicationYear} onChange={(e) => setPublicationYear(e.target.value)} /></label><label className="grid gap-2 text-sm font-semibold">Source type<select className={input} value={sourceType} onChange={(e) => setSourceType(e.target.value)}><option value="BOOK">Book</option><option value="JOURNAL">Peer-reviewed journal</option><option value="OFFICIAL_STANDARD">Official standard</option><option value="OFFICIAL_DOCUMENT">Official document</option><option value="DATASET">Dataset</option><option value="WEBSITE">Website</option></select></label></div>
            <label className="grid gap-2 text-sm font-semibold">HTTPS source URL<input type="url" className={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></label>
            <label className="grid gap-2 text-sm font-semibold">DOI (if available)<input className={input} value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="10.xxxx/..." /></label>
            <label className="grid gap-2 text-sm font-semibold">Verification notes<textarea required minLength={40} rows={4} className={input} value={verificationNotes} onChange={(e) => setVerificationNotes(e.target.value)} placeholder="Where you checked the source, its authority, relevance, edition/date and which learning outcomes it supports." /></label>
            <button disabled={busy || !courseId} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{busy ? "Saving..." : "Record verified source"}</button>
          </form>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Academic quality sign-off</h2>
          <p className="mt-2 text-sm text-slate-300">Mark each criterion honestly. Approval requires all eight to pass and at least three verified references attached to this exact course-stage.</p>
          <form onSubmit={signoff} className="mt-5 grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">{criteriaLabels.map(([key, label]) => <label key={key} className="flex items-start gap-3 rounded-xl border border-white/10 p-3 text-sm"><input type="checkbox" checked={criteria[key] === true} onChange={(e) => setCriteria((current) => ({ ...current, [key]: e.target.checked }))} className="mt-1" /><span>{label}</span></label>)}</div>
            <label className="grid gap-2 text-sm font-semibold">Decision<select className={input} value={decision} onChange={(e) => setDecision(e.target.value)}><option value="REVISION_REQUIRED">Revision required</option><option value="APPROVED">Approve this course-stage</option><option value="REJECTED">Reject this course-stage</option></select></label>
            <label className="grid gap-2 text-sm font-semibold">Reviewer report and evidence<textarea required minLength={80} rows={6} className={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Explain the evidence reviewed, strengths, defects, changes required, source quality and safety considerations." /></label>
            <button disabled={busy || !courseId} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{busy ? "Recording..." : "Record academic sign-off"}</button>
          </form>
        </section>
      </div>
    </main>
  );
}
