"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { FormEvent } from "react";

type Course = { id: string; title: string; description: string; enrolled: boolean; enrollmentStatus: string | null; lessonsCount: number; completedLessons: number; latestAttempt: { passed: boolean } | null };
type Submission = { id: string; courseId: string; courseTitle: string; projectTitle: string; status: string; submittedAt: string; latestReview: { totalScore: number; feedback: string; decision: string; createdAt: string } | null };

const field = "w-full rounded-xl border border-white/15 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none";

export default function AcademyProjectsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [courseId, setCourseId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [methodology, setMethodology] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [reflection, setReflection] = useState("");
  const [evidence, setEvidence] = useState("");
  const [originalityConfirmed, setOriginalityConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    setError("");
    const [courseResponse, projectResponse] = await Promise.all([
      fetch("/api/academy/courses", { cache: "no-store" }),
      fetch("/api/academy/projects", { cache: "no-store" }),
    ]);
    if (courseResponse.status === 401 || projectResponse.status === 401) {
      setError("Please sign in to access practical projects.");
      return;
    }
    const courseData = await courseResponse.json();
    const projectData = await projectResponse.json();
    if (!courseResponse.ok || !projectResponse.ok) throw new Error(courseData.error || projectData.error || "Unable to load project workspace.");
    const enrolled = (courseData.courses || []).filter((course: Course) => course.enrolled);
    setCourses(enrolled);
    setSubmissions(projectData.submissions || []);
    setCourseId((current) => current || enrolled.find((course: Course) => course.enrollmentStatus === "ACTIVE")?.id || enrolled[0]?.id || "");
  }, []);

  useEffect(() => { void refresh().catch((issue) => setError(issue instanceof Error ? issue.message : "Unable to load project workspace.")); }, [refresh]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/academy/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId, projectTitle, objective, methodology, workDescription, reflection,
          evidenceUrls: evidence.split("\n").map((value) => value.trim()).filter(Boolean),
          originalityConfirmed,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Project submission failed.");
      setNotice(result.message || "Project submitted for academic review.");
      setProjectTitle(""); setObjective(""); setMethodology(""); setWorkDescription(""); setReflection(""); setEvidence(""); setOriginalityConfirmed(false);
      await refresh();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Project submission failed.");
    } finally { setBusy(false); }
  }

  const eligible = courses.filter((course) => course.enrollmentStatus === "ACTIVE" && course.completedLessons === course.lessonsCount && course.latestAttempt?.passed);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/academy" className="font-bold tracking-wide">COREVIA RISE ACADEMY</Link>
          <Link href="/academy" className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10">Back to Academy</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-10">
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">Practical assessment</p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">Demonstrate what you can do</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-300">Course completion requires both a passed knowledge assessment and an independently reviewed practical project. Submit your objective, method, work, reflection and supporting evidence. A reviewer assesses five dimensions on a 100-point rubric; 75 points are required for approval.</p>
        </section>

        {error && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200">{error}</p>}
        {notice && <p role="status" className="rounded-xl border border-emerald-400/40 bg-emerald-950/40 p-4 text-emerald-200">{notice}</p>}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <h2 className="text-xl font-bold">Submit your project</h2>
          {eligible.length === 0 ? (
            <p className="mt-3 leading-7 text-slate-300">No enrolled course is currently ready for project submission. Complete every lesson and pass that course's knowledge assessment first.</p>
          ) : (
            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">Course
                <select className={field} value={courseId} onChange={(event) => setCourseId(event.target.value)} required>
                  {eligible.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
                </select>
              </label>
              <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 text-sm leading-6 text-slate-300">
                <p className="font-bold text-cyan-200">Course brief</p>
                <p className="mt-2">{courses.find((course) => course.id === courseId)?.description || "Use the practical assignment in your course lessons as the project brief."}</p>
              </div>
              <label className="grid gap-2 text-sm font-semibold">Project title<input className={field} value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} minLength={4} maxLength={180} required /></label>
              <label className="grid gap-2 text-sm font-semibold">Objective<textarea className={field} value={objective} onChange={(event) => setObjective(event.target.value)} minLength={40} rows={3} required placeholder="What problem, question or outcome does the project address?" /></label>
              <label className="grid gap-2 text-sm font-semibold">Methodology<textarea className={field} value={methodology} onChange={(event) => setMethodology(event.target.value)} minLength={60} rows={4} required placeholder="Explain your approach, tools, steps and why they are suitable." /></label>
              <label className="grid gap-2 text-sm font-semibold">Work completed and findings<textarea className={field} value={workDescription} onChange={(event) => setWorkDescription(event.target.value)} minLength={100} rows={7} required placeholder="Describe what you did, decisions made, results, checks and evidence." /></label>
              <label className="grid gap-2 text-sm font-semibold">Reflection and limitations<textarea className={field} value={reflection} onChange={(event) => setReflection(event.target.value)} minLength={40} rows={4} required placeholder="What did you learn? What limitations or improvements remain?" /></label>
              <label className="grid gap-2 text-sm font-semibold">Evidence links (one HTTPS URL per line; optional)<textarea className={field} value={evidence} onChange={(event) => setEvidence(event.target.value)} rows={3} placeholder="https://..." /></label>
              <label className="flex items-start gap-3 text-sm text-slate-300"><input type="checkbox" checked={originalityConfirmed} onChange={(event) => setOriginalityConfirmed(event.target.checked)} required className="mt-1" /><span>I confirm this is my own work, and that external sources, assistance and third-party materials are acknowledged.</span></label>
              <button disabled={busy || !courseId} className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-50">{busy ? "Submitting..." : "Submit for academic review"}</button>
            </form>
          )}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Your submissions</h2><button onClick={() => void refresh()} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Refresh</button></div>
          {submissions.length === 0 ? <p className="mt-4 text-slate-400">No practical projects submitted yet.</p> : <div className="mt-4 grid gap-3">{submissions.map((item) => <article key={item.id} className="rounded-xl border border-white/10 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{item.projectTitle}</h3><span className="rounded-full border border-white/20 px-3 py-1 text-xs">{item.status.replaceAll("_", " ")}</span></div><p className="mt-1 text-sm text-slate-400">{item.courseTitle} · {new Date(item.submittedAt).toLocaleDateString("en-KE")}</p>{item.latestReview && <div className="mt-3 border-t border-white/10 pt-3"><p className="text-sm font-semibold">Review: {item.latestReview.totalScore}/100 · {item.latestReview.decision.replaceAll("_", " ")}</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.latestReview.feedback}</p></div>}</article>)}</div>}
        </section>
      </div>
    </main>
  );
}
