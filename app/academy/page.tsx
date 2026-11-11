"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  minutes: number;
  content: string[];
  completed: boolean;
};

type Question = {
  id: string;
  prompt: string;
  options: string[];
};

type Review = {
  id: string;
  prompt: string;
  chosenIndex: number;
  correctIndex: number;
  correct: boolean;
  explanation: string;
};

type Completion = {
  certificateCode: string;
  issuedAt: string;
} | null;

type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  level: string;
  priceKsh: number;
  isProgrammeStage: boolean;
  pathwayId: string | null;
  programmeLevel: string | null;
  programmeOrder: number | null;
  prerequisiteCourseId: string | null;
  prerequisiteTitle: string | null;
  locked: boolean;
  enrolled: boolean;
  enrollmentStatus: string | null;
  lessonsCount: number;
questionsCount: number;
completedLessons: number;
  progressPercent: number;
  lessons: Lesson[];
  questions: Question[];
  references: { id: string; title: string; authors: string; publication: string; publicationYear: number | null; url: string | null; doi: string | null; sourceType: string }[];
  latestAttempt: {
    score: number;
    totalQuestions: number;
    passed: boolean;
    createdAt: string;
  } | null;
  completion: Completion;
};

type AssessmentResult = {
  courseId: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  message: string;
  review: Review[];
  completion: Completion;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

const readableDate = (value: string) =>
  new Date(value).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function AcademyPage() {
  const pathname = usePathname();
  const router = useRouter();

  const routeCourseId = pathname.startsWith("/academy/study/")
    ? decodeURIComponent(
        pathname.slice("/academy/study/".length).split("/")[0] || "",
      )
    : "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [catalogFilter, setCatalogFilter] = useState<"programmes" | "short" | "all">("programmes");
  const [memberName, setMemberName] = useState("Corevia member");
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pendingPaymentReference, setPendingPaymentReference] = useState("");
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [working, setWorking] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(routeCourseId);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/academy/courses", {
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401) {
        setAuthRequired(true);
        setCourses([]);
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || "Unable to load Academy courses.");
      }

      setAuthRequired(false);
      setMemberName(result.user?.name || "Corevia member");
      setCourses(result.courses || []);
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to load Academy courses.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyAcademyPayment = useCallback(async (reference: string) => {
    setPendingPaymentReference(reference);
    setVerifyingPayment(true);
    setNotice("Confirming your Academy course payment...");
    setError("");

    try {
      const response = await fetch("/api/academy/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Course payment verification failed.");
      }

      setNotice(result.message || "Payment confirmed. Your course is now available.");
      setError("");
      setPendingPaymentReference("");
      window.history.replaceState({}, "", "/academy");
      await loadCourses();
    } catch (issue) {
      setError(
        issue instanceof Error
          ? `${issue.message} Your payment reference has been kept so you can retry verification. Do not pay again until the status is confirmed.`
          : "Unable to confirm course payment. Retry verification before paying again.",
      );
      setNotice("");
      setPendingPaymentReference(reference);
    } finally {
      setVerifyingPayment(false);
    }
  }, [loadCourses]);

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get("payment");
    const task = window.setTimeout(() => {
      if (reference) {
        void verifyAcademyPayment(reference);
      } else {
        void loadCourses();
      }
    }, 0);
    return () => window.clearTimeout(task);
  }, [loadCourses, verifyAcademyPayment]);

  async function enroll(course: Course) {
    setWorking(course.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/academy/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (typeof result.reference === "string" && result.reference.trim()) {
          setPendingPaymentReference(result.reference);
        }
        throw new Error(result.error || "Enrollment failed.");
      }

      if (result.authorization_url) {
        window.location.assign(result.authorization_url);
        return;
      }

      setExpandedCourse(course.id);
      setNotice(
        result.message || "Enrollment saved. Your lessons are ready.",
      );

      await loadCourses();

      router.push(`/academy/study/${encodeURIComponent(course.id)}`);
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Enrollment failed.",
      );
    } finally {
      setWorking("");
    }
  }

  async function completeLesson(courseId: string, lessonId: string) {
    setWorking(lessonId);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/academy/lesson/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to save lesson progress.",
        );
      }

      setNotice(
        `Lesson saved. Progress: ${result.progressPercent ?? 100}%.`,
      );

      await loadCourses();
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Unable to save lesson progress.",
      );
    } finally {
      setWorking("");
    }
  }

  async function submitAssessment(course: Course) {
    if (
      course.questions.some(
        (question) => answers[question.id] === undefined,
      )
    ) {
      setError("Please answer every assessment question first.");
      return;
    }

    setWorking(`assessment-${course.id}`);
    setError("");
    setNotice("");
    setAssessmentResult(null);

    try {
      const response = await fetch("/api/academy/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
          answers,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Assessment submission failed.",
        );
      }

      setAssessmentResult({
        ...result,
        courseId: course.id,
      });

      setNotice(result.message || "Assessment submitted.");

      await loadCourses();
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Assessment submission failed.",
      );
    } finally {
      setWorking("");
    }
  }

  const visibleCourses = courses.filter((course) =>
    catalogFilter === "all" ||
    (catalogFilter === "programmes" ? course.isProgrammeStage : !course.isProgrammeStage),
  );

  const programmeShelves = Array.from(
    visibleCourses.filter((course) => course.isProgrammeStage).reduce((groups, course) => {
      const key = course.pathwayId || course.title.split(" — ")[0] || course.id;
      const group = groups.get(key) || { id: key, title: course.title.split(" — ")[0], courses: [] as Course[] };
      group.courses.push(course);
      groups.set(key, group);
      return groups;
    }, new Map<string, { id: string; title: string; courses: Course[] }>() ).values(),
  ).map((shelf) => ({ ...shelf, courses: shelf.courses.sort((a, b) => (a.programmeOrder ?? 99) - (b.programmeOrder ?? 99)) }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const shortCourseShelves = Array.from(
    visibleCourses.filter((course) => !course.isProgrammeStage).reduce((groups, course) => {
      const key = course.category || "General";
      const group = groups.get(key) || { id: key, title: key, courses: [] as Course[] };
      group.courses.push(course);
      groups.set(key, group);
      return groups;
    }, new Map<string, { id: string; title: string; courses: Course[] }>() ).values(),
  ).map((shelf) => ({ ...shelf, courses: shelf.courses.sort((a, b) => a.title.localeCompare(b.title)) }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const activeCourseId = routeCourseId ?? expandedCourse;
  const selected = courses.find((course) => course.id === activeCourseId);

  const resultForSelected =
    assessmentResult && assessmentResult.courseId === activeCourseId
      ? assessmentResult
      : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-wide"
          >
            COREVIA RISE <span className="text-cyan-400">ACADEMY</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-300">
              Signed in as {memberName}
            </span>

            <Link
              href="/dashboard"
              className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {!routeCourseId && (
        <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#071321]">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_15%,rgba(8,145,178,0.24),transparent_42%),radial-gradient(ellipse_at_88%_80%,rgba(180,135,55,0.14),transparent_38%)]" />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Corevia Rise Academy
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build knowledge.
                <span className="block text-cyan-300">Prove what you can do.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                A structured learning library for practical skills, guided study and measurable progress. Choose a subject, follow its learning pathway and put your knowledge into practice.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void loadCourses()}
                  disabled={loading}
                  className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-200 disabled:opacity-60"
                >
                  {loading ? "Refreshing..." : "Refresh library"}
                </button>
                <Link
                  href="/academy/projects"
                  className="rounded-xl border border-cyan-200/30 bg-white/[0.04] px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-white/10"
                >
                  Practical project workspace
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Return to Network
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">Your learning journey</p>
                <div className="mt-5 space-y-3">
                  {[
                    ["01", "Choose a subject", "Explore the learning library"],
                    ["02", "Follow the pathway", "Progress one stage at a time"],
                    ["03", "Demonstrate mastery", "Complete lessons and assessments"],
                  ].map(([number, title, detail]) => (
                    <div key={number} className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-slate-950/55 p-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-xs font-black text-cyan-200">{number}</span>
                      <div>
                        <p className="font-bold text-white">{title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <span>Structured learning</span>
                  <span className="font-semibold text-amber-200">Building Trust Through Excellence</span>
                </div>
              </div>
              <div aria-hidden="true" className="absolute -right-4 -top-4 -z-10 h-24 w-24 rounded-full border border-amber-200/20" />
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200"
          >
            {notice}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200"
          >
            {error}
          </div>
        )}

        {pendingPaymentReference && (
          <div className="mb-5 rounded-xl border border-amber-300/30 bg-amber-300/10 p-4">
            <p className="text-amber-100">
              Existing payment reference: <span className="font-mono">{pendingPaymentReference}</span>
            </p>
            <button
              type="button"
              onClick={() => void verifyAcademyPayment(pendingPaymentReference)}
              disabled={verifyingPayment}
              className="mt-3 rounded-lg bg-amber-200 px-4 py-2 font-bold text-slate-950 disabled:opacity-60"
            >
              {verifyingPayment ? "Checking payment..." : "Retry payment verification"}
            </button>
          </div>
        )}

        {authRequired && (
          <div className="mb-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
            <h2 className="text-xl font-bold">
              Sign in to access Academy
            </h2>

            <p className="mt-2 text-slate-300">
              Use the same email and password as your Corevia Rise
              account. You do not need a separate Academy account.
            </p>

            <Link
              href="/login?next=%2Facademy"
              className="mt-4 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950"
            >
              Sign in to Network
            </Link>
          </div>
        )}

        {!routeCourseId && (
          <>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Course catalogue
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Available learning paths
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
                  Browse by subject and choose a learning path. Programme fees are in Kenyan shillings and are separate from the one-time KES 1,000 Network membership. Corevia issues learning-programme completion records; these are not university awards or professional licences.
                </p>
                <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Course catalogue filter">
                  {([
                    ["programmes", "Five-level programmes"],
                    ["short", "Short courses"],
                    ["all", "All learning"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={catalogFilter === value}
                      onClick={() => setCatalogFilter(value)}
                      className={catalogFilter === value
                        ? "rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950"
                        : "rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {catalogFilter !== "short" && (
                  <p className="mt-4 max-w-4xl rounded-2xl border border-amber-200/15 bg-amber-100/[0.04] p-4 text-sm leading-7 text-slate-200">
                    Progression: Certificate (KES 1,500) → Diploma (KES 3,500) → Degree (KES 7,500) → Masters (KES 12,500) → Doctoral Research Preparation (KES 20,000).
                    Each stage unlocks only after the previous stage is completed and its assessment is passed.
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-400">
                {courses.filter((course) => course.completion).length}{" "}
                completed |{" "}
                {
                  courses.filter(
                    (course) => course.enrolled && !course.completion,
                  ).length
                }{" "}
                in progress
              </p>
            </div>

            {loading && courses.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-slate-300">
                Loading your courses...
              </div>
            )}

            {!loading && courses.length === 0 && !authRequired && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                No courses are available right now. Please refresh or
                contact Corevia support.
              </div>
            )}

            <div className="space-y-10">
              {(catalogFilter !== "short" ? programmeShelves : []).map((shelf) => (
                <section key={shelf.id} aria-labelledby={`shelf-${shelf.id}`} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950 shadow-xl shadow-black/20 transition duration-300 hover:border-cyan-200/25">
                  <div className="border-b border-white/10 bg-[linear-gradient(115deg,rgba(8,47,73,0.9),rgba(15,23,42,0.98)_55%,rgba(120,83,30,0.18))] px-5 py-6 sm:px-7">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Programme collection · Subject shelf</p>
                        <h3 id={`shelf-${shelf.id}`} className="mt-1 text-2xl font-black text-white">{shelf.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{shelf.courses.length} sequential stages · arranged from foundation to advanced study</p>
                      </div>
                      <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">Learning pathway</span>
                    </div>
                    <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {[
                        ["01", "Certificate", 1500],
                        ["02", "Diploma", 3500],
                        ["03", "Degree", 7500],
                        ["04", "Masters", 12500],
                        ["05", "Doctoral prep", 20000],
                      ].map(([number, label, fee]) => {
                        const stage = shelf.courses.find((item) => item.programmeOrder === Number(number));
                        return (
                          <li key={number} className={stage?.completion ? "rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3" : stage?.enrolled ? "rounded-xl border border-cyan-300/40 bg-cyan-300/10 p-3" : "rounded-xl border border-white/10 bg-slate-950/60 p-3"}>
                            <span className="block text-[10px] font-black tracking-widest text-cyan-300">STAGE {number}</span>
                            <span className="mt-1 block text-xs font-bold text-white">{label}</span>
                            <span className="mt-1 block text-xs text-slate-400">{money(Number(fee))}</span>
                            <span className="mt-2 block text-[10px] text-slate-400">{stage?.completion ? "Completed" : stage?.enrolled ? `${stage.progressPercent}% in progress` : stage?.locked ? "Locked" : stage ? "Available" : "Coming soon"}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                  <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                    {shelf.courses.map((course) => (
                  <article
                    key={course.id}
                    className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 sm:p-6 ${
                      course.completion
                        ? "border-emerald-400/40 bg-emerald-400/5"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                        {course.category}
                      </span>
  
                      <span className="text-sm font-bold text-amber-200">
                        {money(course.priceKsh)}
                      </span>
                    </div>
  
                    <h3 className="mt-4 min-h-[3.5rem] text-xl font-extrabold leading-snug tracking-tight text-white">
                      {course.title}
                    </h3>
                    {course.isProgrammeStage && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                        {course.programmeLevel} pathway stage {course.programmeOrder} of 5
                      </p>
                    )}
                    {course.locked && course.prerequisiteTitle && (
                      <p className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
                        Locked until you complete: {course.prerequisiteTitle}
                      </p>
                    )}
  
                    <p className="mt-3 line-clamp-4 min-h-[6rem] text-sm leading-6 text-slate-300">
                      {course.description}
                    </p>
                    <Image
                      src={`/academy/course-illustrations/${course.id}.svg`}
                      alt={`${course.title} course illustration`}
                      width={960}
                      height={420}
                      className="mt-4 aspect-[16/9] h-auto w-full rounded-2xl border border-white/10 bg-slate-950 object-cover"
                    />
  
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.level}
                      </span>
  
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.lessonsCount} lessons
                      </span>
  
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.questionsCount} assessment questions
                      </span>
                    </div>
  
                    {course.enrolled && (
                      <div className="mt-5">
                        <div className="flex justify-between text-sm">
                          <span>
                            {course.completion
                              ? "Completed"
                              : "Lesson progress"}
                          </span>
  
                          <span>{course.progressPercent}%</span>
                        </div>
  
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${course.progressPercent}%`,
                            }}
                          />
                        </div>
  
                        {course.latestAttempt && !course.completion && (
                          <p className="mt-2 text-xs text-slate-400">
                            Last assessment: {course.latestAttempt.score}% |{" "}
                            {course.latestAttempt.passed
                              ? "Passed"
                              : "Try again"}
                          </p>
                        )}
                      </div>
                    )}
  
                    <button
                      type="button"
                      disabled={working === course.id || authRequired}
                      onClick={() => {
                        if (course.locked && course.prerequisiteCourseId) {
                          router.push(`/academy/study/${encodeURIComponent(course.prerequisiteCourseId)}`);
                        } else if (course.enrolled) {
                          router.push(`/academy/study/${encodeURIComponent(course.id)}`);
                        } else {
                          void enroll(course);
                        }
                      }}
                      className="mt-6 w-full rounded-xl bg-cyan-300 px-5 py-3.5 text-sm font-extrabold text-slate-950 shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {working === course.id
                        ? "Please wait..."
                        : course.locked
                          ? "Open prerequisite stage"
                          : course.enrolled
                            ? course.completion
                              ? "View completion record"
                              : "Open course"
                            : course.priceKsh > 0
                              ? `Enroll & Pay ${money(course.priceKsh)}`
                              : "Enroll"}
                    </button>
                  </article>
                    ))}
                  </div>
                </section>
              ))}
              {catalogFilter !== "programmes" && shortCourseShelves.map((shelf) => (
                <section key={shelf.id} aria-labelledby={`short-shelf-${shelf.id}`} className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 sm:p-7">
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Library collection · Short courses</p>
                      <h3 id={`short-shelf-${shelf.id}`} className="mt-1 text-2xl font-bold text-white">{shelf.title}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{shelf.courses.length} {shelf.courses.length === 1 ? "course" : "courses"}</span>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {shelf.courses.map((course) => (
                  <article
                    key={course.id}
                    className={`rounded-2xl border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 sm:p-6 ${
                      course.completion
                        ? "border-emerald-400/40 bg-emerald-400/5"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200">
                        {course.category}
                      </span>
  
                      <span className="text-sm font-bold text-amber-200">
                        {money(course.priceKsh)}
                      </span>
                    </div>
  
                    <h3 className="mt-5 text-2xl font-bold">
                      {course.title}
                    </h3>
                    {course.isProgrammeStage && (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                        {course.programmeLevel} pathway stage {course.programmeOrder} of 5
                      </p>
                    )}
                    {course.locked && course.prerequisiteTitle && (
                      <p className="mt-3 rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
                        Locked until you complete: {course.prerequisiteTitle}
                      </p>
                    )}
  
                    <p className="mt-3 min-h-20 leading-7 text-slate-300">
                      {course.description}
                    </p>
                    <Image
                      src={`/academy/course-illustrations/${course.id}.svg`}
                      alt={`${course.title} course illustration`}
                      width={960}
                      height={420}
                      className="mt-4 h-auto w-full rounded-xl border border-white/10"
                    />
  
                    <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.level}
                      </span>
  
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.lessonsCount} lessons
                      </span>
  
                      <span className="rounded-full border border-white/10 px-3 py-1">
                        {course.questionsCount} assessment questions
                      </span>
                    </div>
  
                    {course.enrolled && (
                      <div className="mt-5">
                        <div className="flex justify-between text-sm">
                          <span>
                            {course.completion
                              ? "Completed"
                              : "Lesson progress"}
                          </span>
  
                          <span>{course.progressPercent}%</span>
                        </div>
  
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${course.progressPercent}%`,
                            }}
                          />
                        </div>
  
                        {course.latestAttempt && !course.completion && (
                          <p className="mt-2 text-xs text-slate-400">
                            Last assessment: {course.latestAttempt.score}% |{" "}
                            {course.latestAttempt.passed
                              ? "Passed"
                              : "Try again"}
                          </p>
                        )}
                      </div>
                    )}
  
                    <button
                      type="button"
                      disabled={working === course.id || authRequired}
                      onClick={() => {
                        if (course.locked && course.prerequisiteCourseId) {
                          router.push(`/academy/study/${encodeURIComponent(course.prerequisiteCourseId)}`);
                        } else if (course.enrolled) {
                          router.push(`/academy/study/${encodeURIComponent(course.id)}`);
                        } else {
                          void enroll(course);
                        }
                      }}
                      className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {working === course.id
                        ? "Please wait..."
                        : course.locked
                          ? "Open prerequisite stage"
                          : course.enrolled
                            ? course.completion
                              ? "View completion record"
                              : "Open course"
                            : course.priceKsh > 0
                              ? `Enroll & Pay ${money(course.priceKsh)}`
                              : "Enroll"}
                    </button>
                  </article>
                    ))}
                  </div>
                </section>
              ))}
              {!visibleCourses.length && !loading && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-slate-300">No courses are listed in this collection yet.</div>
              )}
            </div>
          </>
        )}

        {routeCourseId && loading && (
          <p className="rounded-xl border border-white/10 p-6 text-slate-300">
            Loading your study space...
          </p>
        )}

        {routeCourseId &&
          !loading &&
          !selected &&
          !authRequired && (
            <div className="rounded-xl border border-amber-300/30 p-6">
              <p>
                Course not found. Return to the catalogue and choose a
                course.
              </p>

              <Link
                href="/academy"
                className="mt-4 inline-block rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950"
              >
                Back to catalogue
              </Link>
            </div>
          )}

        {routeCourseId &&
          !loading &&
          selected &&
          !selected.enrolled && (
            <div className="rounded-xl border border-amber-300/30 p-6">
              <p>Enroll in this course before opening its lessons.</p>

              <Link
                href="/academy"
                className="mt-4 inline-block rounded-lg bg-cyan-400 px-4 py-2 font-bold text-slate-950"
              >
                Back to catalogue
              </Link>
            </div>
          )}

        {routeCourseId && selected && selected.enrolled && (
          <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-slate-900/70 p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Course workspace
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {selected.title}
                </h2>
                <Image
                  src={`/academy/course-illustrations/${selected.id}.svg`}
                  alt={`${selected.title} study illustration`}
                  width={960}
                  height={420}
                  className="my-5 h-auto w-full max-w-3xl rounded-2xl border border-white/10"
                />
                <div className="my-5 rounded-2xl border border-cyan-300/20 bg-white p-3 sm:p-5">
                  <Image
                    src={`/academy/learning-visuals/${selected.id}.svg`}
                    alt={`${selected.title} step-by-step visual learning guide`}
                    width={960}
                    height={390}
                    className="h-auto w-full rounded-xl"
                  />
                  <p className="mt-3 text-sm text-slate-700">Use this visual as a map. Read one step, explain it in your own words, then continue.</p>
                </div>

                <p className="mt-2 text-slate-300">
                  Read each lesson and mark it complete. The final
                  assessment unlocks after every lesson is completed.
                </p>
              </div>

              <Link
                href="/academy"
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/10"
              >
                Back to catalogue
              </Link>
            </div>

            <section className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5">
              <h3 className="text-lg font-bold">Verified subject references</h3>
              <p className="mt-2 text-sm text-slate-400">These sources have been checked by an authorised Corevia academic reviewer for this course and stage.</p>
              {selected.references?.length ? (
                <ul className="mt-4 space-y-3">
                  {selected.references.map((reference) => (
                    <li key={reference.id} className="rounded-lg border border-white/10 p-3">
                      <p className="font-semibold">{reference.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{reference.authors} · {reference.publication}{reference.publicationYear ? ` · ${reference.publicationYear}` : ""}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-cyan-200">{reference.sourceType.replaceAll("_", " ")}</p>
                      {reference.url && <a href={reference.url} target="_blank" rel="noreferrer" className="mt-1 inline-block break-all text-sm text-cyan-300 underline">Open source</a>}
                      {reference.doi && <p className="mt-1 text-xs text-slate-400">DOI: {reference.doi}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-amber-200">No verified references have been published for this course-stage yet. Corevia is building the reviewed reading list; unverified suggestions are not presented as approved sources.</p>
              )}
            </section>

            {selected.lessons.map((lesson, index) => (
              <article
                key={lesson.id}
                className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Lesson {index + 1} | {lesson.minutes} minutes
                    </p>

                    <h3 className="mt-2 text-xl font-bold">
                      {lesson.title}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      lesson.completed
                        ? "bg-emerald-400/15 text-emerald-200"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {lesson.completed ? "Completed" : "Not completed"}
                  </span>
                </div>

                <div className="mt-4 space-y-3 leading-7 text-slate-300">
                  {lesson.content.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}
                </div>

                {!lesson.completed && !selected.completion && (
                  <button
                    type="button"
                    disabled={working === lesson.id}
                    onClick={() =>
                      void completeLesson(selected.id, lesson.id)
                    }
                    className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
                  >
                    {working === lesson.id
                      ? "Saving..."
                      : "Mark lesson complete"}
                  </button>
                )}
              </article>
            ))}

            {!selected.completion && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5 sm:p-7">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Final assessment
                </p>

                <h3 className="mt-2 text-2xl font-bold">
                  Check your understanding
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-300">
                  This multiple-choice knowledge check requires at least 75%. Complete all lessons first. You can retry after reviewing the answer explanations. After passing, submit your practical project for independent academic review. Course completion requires both assessments.
                </p>

                {selected.completedLessons < selected.lessonsCount ? (
                  <p className="mt-4 rounded-xl bg-amber-300/10 p-4 text-amber-100">
                    Complete all {selected.lessonsCount} lessons to unlock
                    the assessment ({selected.completedLessons}/
                    {selected.lessonsCount} complete).
                  </p>
                ) : (
                  <form
                    className="mt-5 space-y-6"
                    onSubmit={(event) => {
                      event.preventDefault();
                      void submitAssessment(selected);
                    }}
                  >
                    {selected.questions.map((question, questionIndex) => (
                      <fieldset
                        key={question.id}
                        className="rounded-xl border border-white/10 p-4"
                      >
                        <legend className="px-2 font-semibold">
                          {questionIndex + 1}. {question.prompt}
                        </legend>

                        <div className="mt-3 space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${
                                answers[question.id] === optionIndex
                                  ? "border-cyan-400 bg-cyan-400/10"
                                  : "border-white/10 hover:bg-white/5"
                              }`}
                            >
                              <input
                                type="radio"
                                name={question.id}
                                checked={
                                  answers[question.id] === optionIndex
                                }
                                onChange={() =>
                                  setAnswers((current) => ({
                                    ...current,
                                    [question.id]: optionIndex,
                                  }))
                                }
                                className="mt-1"
                              />

                              <span className="text-sm leading-6">
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}

                    <button
                      type="submit"
                      disabled={working === `assessment-${selected.id}`}
                      className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
                    >
                      {working === `assessment-${selected.id}`
                        ? "Marking assessment..."
                        : "Submit assessment"}
                    </button>
                  </form>
                )}

                {resultForSelected && (
                  <div className="mt-5 rounded-xl border border-white/10 p-4">
                    <h4 className="text-lg font-bold">
                      Result: {resultForSelected.score}% -{" "}
                      {resultForSelected.passed ? "PASSED" : "NOT PASSED"}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{resultForSelected.message}</p>
                    {resultForSelected.passed && (
                      <Link href="/academy/projects" className="mt-3 inline-flex rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950">
                        Submit practical project
                      </Link>
                    )}

                    <div className="mt-4 space-y-3">
                      {resultForSelected.review.map((item) => (
                        <div key={item.id} className="text-sm">
                          <p
                            className={
                              item.correct
                                ? "text-emerald-200"
                                : "text-amber-200"
                            }
                          >
                            {item.correct ? "Correct" : "Review"}:{" "}
                            {item.prompt}
                          </p>

                          <p className="mt-1 text-slate-300">
                            {item.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {selected.completion && (
              <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-300/5 p-6 sm:p-9 print:border-black print:bg-white print:text-black">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-200 print:text-black">
                  Corevia Rise Academy | Completion record
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Course completed
                </h3>

                <p className="mt-4 leading-7">
                  This confirms that <strong>{memberName}</strong> completed
                  the Corevia Rise Academy course{" "}
                  <strong>{selected.title}</strong> and passed its recorded
                  assessment.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 p-4 print:border-black">
                    <p className="text-xs text-slate-400 print:text-black">
                      Completion reference
                    </p>

                    <p className="mt-1 font-bold">
                      {selected.completion.certificateCode}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 p-4 print:border-black">
                    <p className="text-xs text-slate-400 print:text-black">
                      Date issued
                    </p>

                    <p className="mt-1 font-bold">
                      {readableDate(selected.completion.issuedAt)}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-slate-300 print:text-black">
                  Awarded in recognition of successful course completion
                  and achievement of the required assessment standards.
                  Celebrating learning, personal growth, and a commitment
                  to excellence.
                </p>

                <a
                  href={`/api/academy/certificate?courseId=${encodeURIComponent(selected.id)}`}
                  className="mt-5 mr-3 inline-block rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 print:hidden"
                >
                  Download PDF certificate
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-5 rounded-xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 print:hidden"
                >
                  Print completion record
                </button>
              </div>
            )}
          </section>
        )}

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <h2 className="text-xl font-bold">Learning with integrity</h2>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            Corevia Rise Academy issues completion records after learners
            complete all lessons and meet the required assessment
            standards. We celebrate learning, personal growth, and a
            commitment to excellence.
          </p>
        </section>

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
          Corevia Rise Academy | Building Trust Through Excellence.
        </footer>
      </div>
    </main>
  );
}