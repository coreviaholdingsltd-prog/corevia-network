"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "corevia-rise-skill-missions-v1";

const missions = [
  {
    id: "cv-profile",
    number: "01",
    category: "Career readiness",
    title: "Create a one-page CV",
    time: "30–45 min",
    brief: "Prepare a clear one-page CV with contact details, education, skills and any work, volunteer or project experience.",
    deliverable: "A PDF CV with a professional file name.",
    proof: "Ask a trusted person to check spelling and readability.",
  },
  {
    id: "excel-budget",
    number: "02",
    category: "Computer packages",
    title: "Build a personal budget in Excel or Sheets",
    time: "30–60 min",
    brief: "Create a sample monthly budget with income, fixed expenses, flexible expenses, savings and a formula for the balance.",
    deliverable: "A spreadsheet with clear headings and working totals.",
    proof: "Test the formulas by changing one expense and checking the balance.",
  },
  {
    id: "business-poster",
    number: "03",
    category: "Digital creativity",
    title: "Design a simple business poster",
    time: "45–60 min",
    brief: "Choose a fictional or real small business and design a readable poster with a service, value proposition and contact method.",
    deliverable: "One poster image or PDF.",
    proof: "Check that the text is readable on a phone and that you have permission to use any images or logos.",
  },
  {
    id: "pitch-deck",
    number: "04",
    category: "Communication",
    title: "Make a five-slide pitch deck",
    time: "45–90 min",
    brief: "Explain a problem, the intended customer, your solution, how it works and the next step in five simple slides.",
    deliverable: "A five-slide presentation exported to PDF.",
    proof: "Present it aloud in two minutes and remove anything you cannot explain.",
  },
  {
    id: "tech-checklist",
    number: "05",
    category: "Computer engineering",
    title: "Write a safe PC troubleshooting checklist",
    time: "30–45 min",
    brief: "Write a beginner-friendly checklist for common software issues, backups, cables and basic diagnostic steps.",
    deliverable: "A one-page checklist with clear steps and safety warnings.",
    proof: "Do not open power supplies or work on live electrical equipment; keep hardware practice low-voltage and supervised.",
  },
  {
    id: "data-insight",
    number: "06",
    category: "Data skills",
    title: "Turn sample data into three insights",
    time: "45–90 min",
    brief: "Use fictional sales or expense data to create one chart and write three observations supported by the data.",
    deliverable: "A chart plus a short explanation of the three insights.",
    proof: "Check totals and state where your sample data came from.",
  },
  {
    id: "service-offer",
    number: "07",
    category: "Freelancing",
    title: "Write a clear service offer",
    time: "20–30 min",
    brief: "Choose one service you can realistically deliver, define the output, turnaround time, what you need from a client and a fair starter price.",
    deliverable: "A short service description and a sample of the work.",
    proof: "Be honest about your current experience and never promise results you cannot control.",
  },
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function SkillMissionsPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setCompleted(
          parsed.filter(
            (id): id is string =>
              typeof id === "string" && missions.some((mission) => mission.id === id),
          ),
        );
      }
    } catch {
      setCompleted([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      setMessage("Progress could not be saved on this browser. You can still download your portfolio.");
    }
  }, [completed, loaded]);

  const completedCount = completed.length;
  const progress = Math.round((completedCount / missions.length) * 100);
  const completedMissions = useMemo(
    () => missions.filter((mission) => completed.includes(mission.id)),
    [completed],
  );

  function toggleMission(id: string) {
    setMessage("");
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function downloadPortfolio() {
    const date = new Date().toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const rows = missions.map((mission) => {
      const done = completed.includes(mission.id);
      return "<li><strong>" + escapeHtml(mission.title) + "</strong> — " +
        (done ? "Marked completed" : "Not yet completed") +
        "<br><span>" + escapeHtml(mission.deliverable) + "</span></li>";
    }).join("\n");
    const html = "<!doctype html><html lang=\"en\"><meta charset=\"utf-8\">" +
      "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
      "<title>Corevia Rise Practice Portfolio</title>" +
      "<style>body{font:16px/1.6 system-ui,sans-serif;max-width:850px;margin:40px auto;padding:0 20px;color:#12352c}h1{line-height:1.15}small{color:#596b64}.panel{background:#f7f5ef;padding:18px;border-radius:14px}li{margin:16px 0}span{color:#596b64}</style>" +
      "<body><p><strong>COREVIA RISE · SKILL MISSIONS</strong></p>" +
      "<h1>My Practice Portfolio</h1><p class=\"panel\">Progress: " + completedCount + " of " + missions.length +
      " missions marked completed (" + progress + "%).<br>Prepared on " + escapeHtml(date) + ".</p>" +
      "<p>This is a self-reported practice log, not an examination result, professional licence or guarantee of employment. Include only work you actually completed and be ready to demonstrate it.</p>" +
      "<h2>Practice mission record</h2><ol>" + rows + "</ol>" +
      "<h2>Work sample checklist</h2><p>Attach the actual CV, spreadsheet, poster, presentation, checklist, chart or service sample before sharing this portfolio with a potential client or employer.</p>" +
      "<hr><p><strong>COREVIA HOLDINGS LTD</strong><br>Building Trust Through Excellence.</p></body></html>";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "corevia-rise-practice-portfolio.html";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Portfolio downloaded. Attach real work samples before sharing it.");
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#12352c]">
      <header className="border-b border-[#12352c]/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <Link href="/" className="text-lg font-black tracking-tight">COREVIA RISE <span className="text-[#a88949]">/ SKILL MISSIONS</span></Link>
          <nav aria-label="Skill mission navigation" className="flex flex-wrap gap-2 text-sm font-semibold">
            <Link href="/opportunities" className="rounded-full border border-[#12352c]/15 px-4 py-2 hover:bg-[#f7f5ef]">Opportunities</Link>
            <Link href="/academy" className="rounded-full border border-[#12352c]/15 px-4 py-2 hover:bg-[#f7f5ef]">Academy</Link>
            <Link href="/register" className="rounded-full bg-[#12352c] px-4 py-2 text-white hover:bg-[#1b493c]">Join Corevia Rise</Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#12352c] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d6bb7e]">Learn by doing · Keep your evidence</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-6xl">Small missions. Real work samples. A stronger next step.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-white/80">Complete practical starter challenges, keep the files you create, and download a portfolio summary. You can explore these missions without paying or signing in.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#missions" className="rounded-full bg-[#d6bb7e] px-6 py-3 font-bold text-[#12352c] hover:bg-[#e5d1a2]">Choose a mission</a>
            <button type="button" onClick={downloadPortfolio} className="rounded-full border border-white/30 px-6 py-3 font-bold text-white hover:bg-white/10">Download my portfolio</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="rounded-3xl border border-[#12352c]/10 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">Your progress</p>
              <h2 className="mt-2 text-2xl font-black">{completedCount} of {missions.length} missions completed</h2>
            </div>
            <p className="text-3xl font-black text-[#a88949]">{progress}%</p>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#12352c]/10" role="progressbar" aria-label="Skill mission progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-[#b99a58] transition-all" style={{ width: progress + "%" }} />
          </div>
          <p className="mt-3 text-sm leading-6 text-[#12352c]/65">Progress is saved in this browser on this device; it is not yet synced to your Corevia account. Mark a mission completed only after you create its work sample.</p>
          {message && <p role="status" className="mt-3 text-sm font-semibold text-[#12352c]">{message}</p>}
        </div>
      </section>

      <section id="missions" className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">Choose your first challenge</p>
            <h2 className="mt-2 text-3xl font-black">Seven practical missions</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#12352c]/70">These are starter projects—not proof of employment or professional certification. Keep your original files so employers or clients can inspect the actual work.</p>
          </div>
          <Link href="/academy" className="font-bold underline decoration-[#b99a58] decoration-2 underline-offset-4">Find related lessons ↗</Link>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {missions.map((mission) => {
            const isCompleted = completed.includes(mission.id);
            return (
              <article key={mission.id} className={"rounded-3xl border bg-white p-5 sm:p-6 " + (isCompleted ? "border-[#b99a58] ring-1 ring-[#b99a58]/30" : "border-[#12352c]/10")}>
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-[#f7f5ef] px-3 py-1.5 text-xs font-bold">{mission.category}</span>
                  <span className="text-sm font-black text-[#b99a58]">{mission.number} / 07</span>
                </div>
                <h3 className="mt-4 text-xl font-extrabold">{mission.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#12352c]/75">{mission.brief}</p>
                <div className="mt-4 rounded-xl bg-[#f7f5ef] p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-[#a88949]">Deliverable · {mission.time}</p>
                  <p className="mt-1 text-sm font-semibold">{mission.deliverable}</p>
                  <p className="mt-2 text-sm leading-6 text-[#12352c]/65">{mission.proof}</p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <button type="button" aria-pressed={isCompleted} onClick={() => toggleMission(mission.id)} className={"rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#b99a58] focus:ring-offset-2 " + (isCompleted ? "border border-[#12352c]/20 bg-white" : "bg-[#12352c] text-white")}>
                    {isCompleted ? "✓ Completed — undo" : "Mark mission completed"}
                  </button>
                  <span className="text-xs font-semibold text-[#12352c]/50">{isCompleted ? "Added to your portfolio" : "Keep your work sample"}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[#12352c]/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-2">
          <article className="rounded-3xl bg-[#f7f5ef] p-6">
            <h2 className="text-xl font-black">Want to build the skill behind a mission?</h2>
            <p className="mt-3 text-sm leading-6 text-[#12352c]/70">Explore structured courses in Microsoft Office, data analysis, computer support, programming, engineering foundations and business skills.</p>
            <Link href="/academy" className="mt-5 inline-flex rounded-xl bg-[#12352c] px-5 py-3 font-bold text-white">Explore Academy</Link>
          </article>
          <article className="rounded-3xl border border-[#12352c]/10 p-6">
            <h2 className="text-xl font-black">Ready to find opportunities?</h2>
            <p className="mt-3 text-sm leading-6 text-[#12352c]/70">Browse official Kenyan job portals and youth-support programmes. Confirm requirements directly with each provider before applying.</p>
            <Link href="/opportunities" className="mt-5 inline-flex rounded-xl border border-[#12352c]/20 px-5 py-3 font-bold">Explore opportunities</Link>
          </article>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-7 text-sm text-[#12352c]/60 sm:px-8">
        <span>COREVIA HOLDINGS LTD · Building Trust Through Excellence.</span>
        <Link href="/" className="font-bold underline underline-offset-4">Back to Corevia Rise</Link>
      </footer>
    </main>
  );
}
