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
  academicApproved: boolean;
  pilotEnrollmentOpen: boolean;
  enrollmentOpen: boolean;
  academicApprovalStatus: string;
  verifiedReferencesCount: number;
  requiredVerifiedReferences: number;
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const visibleCourses = courses.filter((course) => {
    const matchesType = catalogFilter === "all" ||
      (catalogFilter === "programmes" ? course.isProgrammeStage : !course.isProgrammeStage);
    const matchesSearch = !normalizedSearch ||
      [course.title, course.category, course.description, course.programmeLevel ?? ""]
        .some((value) => value.toLocaleLowerCase().includes(normalizedSearch));
    return matchesType && matchesSearch;
  });

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

  const selectedPathway = selected?.pathwayId
    ? courses
        .filter((course) => course.pathwayId === selected.pathwayId)
        .sort((a, b) => (a.programmeOrder ?? 99) - (b.programmeOrder ?? 99))
    : [];
  const selectedActiveStage =
    selectedPathway.find((stage) => !stage.completion) ??
    selectedPathway[selectedPathway.length - 1] ??
    null;

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
        <section className="border-b border-white/10 bg-[#071321]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-8 sm:py-7">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">Corevia Rise Academy</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">Find your course. Start learning.</h1>
              <p className="mt-1 text-sm text-slate-400">Choose a subject and follow its learning path.</p>
            </div>
            <Link href="/dashboard" className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10">Dashboard</Link>
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
            <div className="mb-5 border-b border-white/10 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">Choose a subject</h2>
                  <p className="mt-1 text-xs text-slate-400">{visibleCourses.length} courses available</p>
                </div>
                <Link href="/academy/projects" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">Project workspace →</Link>
              </div>
              <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/15 bg-slate-900 px-3 py-2.5 focus-within:border-cyan-300/60">
                <span aria-hidden="true" className="text-slate-400">⌕</span>
                <input type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search subjects or courses" aria-label="Search subjects or courses" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
                {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="text-xs text-cyan-300">Clear</button>}
              </label>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Course catalogue filter">
                {([
                  ["programmes", "Programmes"],
                  ["short", "Short courses"],
                  ["all", "All courses"],
                ] as const).map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={catalogFilter === value} onClick={() => setCatalogFilter(value)}
                    className={catalogFilter === value ? "shrink-0 rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950" : "shrink-0 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"}>
                    {label}
                  </button>
                ))}
              </div>
              {catalogFilter !== "short" && <p className="mt-3 text-[11px] text-slate-500">Certificate → Diploma → Degree → Masters → Doctoral Research Preparation. Each stage unlocks in sequence.</p>}
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
              {(catalogFilter !== "short" ? programmeShelves : []).map((shelf) => {
                const activeStage = shelf.courses.find((stage) => !stage.completion) ?? shelf.courses[shelf.courses.length - 1];
                const course = activeStage;
                return (
                  <section key={shelf.id} className="rounded-2xl border border-white/10 bg-slate-900/65 p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="min-w-0 truncate text-sm font-bold text-white sm:text-base">{shelf.title}</h3>
                      <span className="shrink-0 text-[10px] text-slate-500">5 stages</span>
                    </div>
                    <ol className="mt-2 flex gap-1 overflow-x-auto pb-1">
                      {[
                        ["01", "Certificate"], ["02", "Diploma"], ["03", "Degree"], ["04", "Masters"], ["05", "Doctoral prep"],
                      ].map(([number, label]) => {
                        const stage = shelf.courses.find((item) => item.programmeOrder === Number(number));
                        const current = Boolean(stage && stage.id === activeStage?.id);
                        return (
                          <li key={number} className={`min-w-0 flex-1 rounded-md px-1.5 py-1.5 text-center ${stage?.completion ? "bg-emerald-400/10 text-emerald-200" : current ? "bg-cyan-300/15 text-cyan-100 ring-1 ring-cyan-300/30" : "bg-slate-950/70 text-slate-500"}`}>
                            <span className="block text-[9px] font-bold">{number}</span><span className="block truncate text-[9px] font-semibold">{label}</span>
                          </li>
                        );
                      })}
                    </ol>
                    {course && (
                      <article className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/70 p-3">
                        <Image src={`/academy/course-illustrations/${course.id}.svg`} alt="" aria-hidden="true" width={72} height={72} className="h-14 w-14 shrink-0 rounded-lg border border-white/10 bg-slate-900 object-cover sm:h-16 sm:w-16" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-semibold text-cyan-300">{course.programmeLevel || "Programme"}</span><span className="text-[10px] text-amber-200">{money(course.priceKsh)}</span></div>
                          <h4 className="mt-0.5 line-clamp-1 text-sm font-bold text-white">{course.title}</h4>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{course.description}</p>
                          {course.enrolled && <p className="mt-1 text-[10px] text-slate-500">{course.completion ? "Completed" : `${course.progressPercent}% complete`}</p>}
                        </div>
                        <button type="button" disabled={working === course.id || authRequired}
                          onClick={() => {
                            if (course.locked && course.prerequisiteCourseId) router.push(`/academy/study/${encodeURIComponent(course.prerequisiteCourseId)}`);
                            else if (course.enrolled) router.push(`/academy/study/${encodeURIComponent(course.id)}`);
                            else router.push(`/academy/study/${encodeURIComponent(course.id)}`);
                          }}
                          className="shrink-0 rounded-lg bg-cyan-300 px-3 py-2.5 text-[11px] font-extrabold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
                          {working === course.id ? "Wait…" : course.locked ? "Continue previous" : course.enrolled ? (course.completion ? "View record" : "Continue") : "View course"}
                        </button>
                      </article>
                    )}
                  </section>
                );
              })}
              {catalogFilter !== "programmes" && shortCourseShelves.map((shelf) => (
                <section key={shelf.id} className="rounded-2xl border border-white/10 bg-slate-900/55 p-3 sm:p-4">
                  <div className="mb-2 flex items-center justify-between gap-2"><h3 className="text-sm font-bold text-white">{shelf.title}</h3><span className="text-[10px] text-slate-500">{shelf.courses.length} courses</span></div>
                  <div className="divide-y divide-white/10">
                    {shelf.courses.map((course) => (
                      <article key={course.id} className="flex items-center gap-3 py-3">
                        <Image src={`/academy/course-illustrations/${course.id}.svg`} alt="" aria-hidden="true" width={64} height={64} className="h-12 w-12 shrink-0 rounded-lg border border-white/10 bg-slate-950 object-cover" />
                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-1 text-sm font-semibold text-white">{course.title}</h4>
                          <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{course.description}</p>
                          <p className="mt-1 text-[10px] text-amber-200">{money(course.priceKsh)} <span className="text-slate-500">· {course.lessonsCount} lessons</span></p>
                        </div>
                        <button type="button" disabled={working === course.id || authRequired} onClick={() => router.push(`/academy/study/${encodeURIComponent(course.id)}`)}
                          className="shrink-0 rounded-lg bg-cyan-300 px-3 py-2 text-[11px] font-bold text-slate-950 hover:bg-cyan-200 disabled:opacity-60">
                          {working === course.id ? "Wait…" : course.enrolled ? "Open" : "Choose"}
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

        {routeCourseId && selected && !selected.enrolled && (
          <section className="mt-8 max-w-3xl rounded-2xl border border-cyan-300/25 bg-slate-900/80 p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Course overview</p>
            <h2 className="mt-2 text-2xl font-black text-white">{selected.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">{selected.description}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-950 p-3"><p className="text-[10px] text-slate-400">Programme stage</p><p className="mt-1 text-sm font-bold text-white">{selected.programmeLevel || selected.level}</p></div>
              <div className="rounded-xl bg-slate-950 p-3"><p className="text-[10px] text-slate-400">Lessons</p><p className="mt-1 text-sm font-bold text-white">{selected.lessonsCount}</p></div>
              <div className="rounded-xl bg-slate-950 p-3"><p className="text-[10px] text-slate-400">Enrolment fee</p><p className="mt-1 text-sm font-bold text-white">{money(selected.priceKsh)}</p></div>
            </div>
            {selected.locked && <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">Complete the previous programme stage before enrolling in this stage.</p>}
            {selected.isProgrammeStage && !selected.academicApproved && selected.pilotEnrollmentOpen && (
              <div className="mt-4 rounded-xl border border-cyan-300/25 bg-cyan-300/10 p-4">
                <p className="text-sm font-bold text-cyan-100">Paid pilot enrolment is open</p>
                <p className="mt-1 text-xs leading-5 text-cyan-100/80">This is a company-authorised, non-accredited Certificate completion pilot. Academic review continues; {selected.verifiedReferencesCount} of {selected.requiredVerifiedReferences} references are recorded as verified. The completion certificate is not a university award, professional licence or accredited qualification.</p>
              </div>
            )}
            {!selected.enrollmentOpen && selected.priceKsh > 0 && (
              <div className="mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 p-4">
                <p className="text-sm font-bold text-amber-100">{selected.isProgrammeStage ? "Payment opens after academic approval" : "Paid enrolment is not yet open"}</p>
                <p className="mt-1 text-xs leading-5 text-amber-100/80">{selected.isProgrammeStage
                  ? `This course is available to preview. Paid enrolment will open when its academic sign-off is approved and at least ${selected.requiredVerifiedReferences} subject-specific references are verified. ${selected.verifiedReferencesCount} of ${selected.requiredVerifiedReferences} references are verified so far.`
                  : "This course is available to preview. Its paid enrolment has not been authorised yet, so no payment can be started."}</p>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" disabled={working === selected.id || selected.locked || !selected.enrollmentOpen} onClick={() => void enroll(selected)} className="rounded-xl bg-cyan-300 px-5 py-3 text-sm font-extrabold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">{working === selected.id ? "Please wait…" : (selected.academicApproved || selected.pilotEnrollmentOpen) ? `Enrol & Pay · ${money(selected.priceKsh)}` : `Enrol & Pay · ${money(selected.priceKsh)} (Not yet open)`}</button>
              <Link href="/academy" className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">Back to catalogue</Link>
            </div>
            <p className="mt-3 text-xs text-slate-500">{selected.pilotEnrollmentOpen
              ? "Preview is free. This company-authorised Accounting Certificate pilot can start a KES 1,500 Paystack checkout; course access is activated only after Paystack confirms payment."
              : selected.enrollmentOpen
                ? "Preview is free. Paid enrolment is open for this course; access is activated only after payment is confirmed."
                : "Preview is free. Paid enrolment is not open for this course, and no payment will be initiated until it is authorised."}</p>
          </section>
        )}

        {routeCourseId && selected && selected.enrolled && (
          <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-slate-900/70 p-5 sm:p-8">
            {selectedPathway.length > 0 && (
              <div className="mb-7 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your complete subject journey</p>
                    <h3 className="mt-1 text-lg font-extrabold text-white">One subject. Five stages. One step at a time.</h3>
                  </div>
                  <p className="text-xs text-slate-400">The next stage opens after you pass the current stage and meet its completion requirements.</p>
                </div>
                <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[
                    ["01", "Certificate", 1500],
                    ["02", "Diploma", 3500],
                    ["03", "Degree", 7500],
                    ["04", "Masters", 12500],
                    ["05", "Doctoral prep", 20000],
                  ].map(([number, label, fee]) => {
                    const stage = selectedPathway.find((item) => item.programmeOrder === Number(number));
                    const isCurrent = Boolean(stage && stage.id === selectedActiveStage?.id);
                    return (
                      <li key={number} className={stage?.completion ? "rounded-xl border border-emerald-300/30 bg-emerald-300/10 p-3" : isCurrent ? "rounded-xl border border-cyan-300/40 bg-cyan-300/10 p-3 ring-1 ring-cyan-300/20" : "rounded-xl border border-white/10 bg-slate-900/70 p-3"}>
                        <span className="block text-[10px] font-black tracking-widest text-cyan-300">STAGE {number}</span>
                        <span className="mt-1 block text-xs font-bold text-white">{label}</span>
                        <span className="mt-1 block text-xs text-slate-400">{money(Number(fee))}</span>
                        <span className="mt-2 block text-[10px] text-slate-400">{stage?.completion ? "Completed" : isCurrent ? (stage?.enrolled ? `${stage.progressPercent}% · Current` : "Next to begin") : stage?.locked ? "Locked" : stage ? "Upcoming" : "Coming soon"}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
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