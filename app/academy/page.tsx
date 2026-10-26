"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  enrolled: boolean;
  enrollmentStatus: string | null;
  lessonsCount: number;
questionsCount: number;
completedLessons: number;
  progressPercent: number;
  lessons: Lesson[];
  questions: Question[];
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

  const routeCourseId = pathname.startsWith("/academy/study/")
    ? decodeURIComponent(
        pathname.slice("/academy/study/".length).split("/")[0] || "",
      )
    : "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [memberName, setMemberName] = useState("Corevia member");
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
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

  useEffect(() => {
    if (routeCourseId) {
      setExpandedCourse(routeCourseId);
    }
  }, [routeCourseId]);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      const reference = new URLSearchParams(window.location.search).get(
        "payment",
      );

      if (reference) {
        setNotice("Confirming your Academy course payment...");
        setError("");

        try {
          const response = await fetch("/api/academy/payments/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reference }),
            cache: "no-store",
          });

          const result = await response.json();

          if (!response.ok) {
            if (!cancelled) {
              setError(
                result.error || "Course payment verification failed.",
              );
              setNotice("");
            }
          } else if (!cancelled) {
            setNotice("Payment confirmed. Your course is now available.");
            setError("");
          }

          if (!cancelled) {
            window.history.replaceState({}, "", "/academy");
          }
        } catch {
          if (!cancelled) {
            setError(
              "Unable to confirm course payment. Use Refresh courses to check again.",
            );
            setNotice("");
          }
        }
      }

      if (!cancelled) {
        await loadCourses();
      }
    }

    void start();

    return () => {
      cancelled = true;
    };
  }, [loadCourses]);

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
        throw new Error(result.error || "Enrollment failed.");
      }

      if (result.authorization_url) {
        window.location.href = result.authorization_url;
        return;
      }

      setExpandedCourse(course.id);
      setNotice(
        result.message || "Enrollment saved. Your lessons are ready.",
      );

      await loadCourses();

      window.location.href = `/academy/study/${encodeURIComponent(course.id)}`;
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

  const selected = courses.find(
    (course) => course.id === expandedCourse,
  );

  const resultForSelected =
    assessmentResult &&
    assessmentResult.courseId === expandedCourse
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
            COREVIA <span className="text-cyan-400">ACADEMY</span>
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
        <section className="border-b border-white/10 bg-gradient-to-br from-cyan-950 via-slate-950 to-blue-950">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
              Your learning space
            </p>

            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
              Learn new skills. Track your progress. Demonstrate what you
              know.
            </h1>

            <p className="mt-5 max-w-3xl leading-7 text-slate-300">
              Use your existing Corevia Network account to enroll, work
              through lessons, complete assessments, and access your course
              completion record.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void loadCourses()}
                disabled={loading}
                className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
              >
                {loading ? "Refreshing..." : "Refresh courses"}
              </button>

              <Link
                href="/dashboard"
                className="rounded-xl border border-white/20 px-5 py-3 font-bold hover:bg-white/10"
              >
                Return to Network
              </Link>
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

        {authRequired && (
          <div className="mb-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
            <h2 className="text-xl font-bold">
              Sign in to access Academy
            </h2>

            <p className="mt-2 text-slate-300">
              Use the same email and password as your Corevia Network
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
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Course catalogue
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  Available learning paths
                </h2>

                <p className="mt-2 text-slate-300">
                  Course fees are shown in Kenyan shillings and are paid
                  separately from the one-time Corevia Network membership
                  activation.
                </p>
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

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => (
                <article
                  key={course.id}
                  className={`rounded-2xl border p-6 ${
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

                  <p className="mt-3 min-h-20 leading-7 text-slate-300">
                    {course.description}
                  </p>

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
                      if (course.enrolled) {
                        window.location.href = `/academy/study/${encodeURIComponent(course.id)}`;
                      } else {
                        void enroll(course);
                      }
                    }}
                    className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {working === course.id
                      ? "Please wait..."
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
                  You need at least 75% to pass. Complete all lessons first.
                  You can retry after reviewing the feedback.
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
                  Corevia Academy | Completion record
                </p>

                <h3 className="mt-3 text-3xl font-black">
                  Course completed
                </h3>

                <p className="mt-4 leading-7">
                  This confirms that <strong>{memberName}</strong> completed
                  the Corevia Academy course{" "}
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
            Corevia Academy issues completion records after learners
            complete all lessons and meet the required assessment
            standards. We celebrate learning, personal growth, and a
            commitment to excellence.
          </p>
        </section>

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-slate-500">
          Corevia Academy | Building Trust Through Excellence.
        </footer>
      </div>
    </main>
  );
}