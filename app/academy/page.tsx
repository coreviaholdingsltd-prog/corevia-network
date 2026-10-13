
import Link from "next/link";

const categories = [
  {
    number: "01",
    title: "Digital & ICT Skills",
    description:
      "Computer fundamentals, internet skills, cybersecurity awareness, and digital productivity.",
  },
  {
    number: "02",
    title: "AI & Programming",
    description:
      "Artificial intelligence fundamentals, web development, programming, and practical technology projects.",
  },
  {
    number: "03",
    title: "Business & Entrepreneurship",
    description:
      "Business planning, customer service, financial literacy, leadership, and business development.",
  },
  {
    number: "04",
    title: "Digital Marketing & Office Tools",
    description:
      "Social media marketing, content creation, spreadsheets, documents, and presentation skills.",
  },
  {
    number: "05",
    title: "Professional & Technical Skills",
    description:
      "Career readiness, workplace communication, practical skills, and selected technical learning.",
  },
  {
    number: "06",
    title: "Learning Pathways",
    description:
      "Guidance toward suitable courses and eligible education or training providers.",
  },
];

const learningSteps = [
  {
    number: "01",
    title: "Learn",
    description: "Study structured lessons, learning notes, and course materials.",
  },
  {
    number: "02",
    title: "Practise",
    description: "Complete assignments and practical activities where required.",
  },
  {
    number: "03",
    title: "Get assessed",
    description: "Complete the relevant quizzes, exams, or other course assessments.",
  },
  {
    number: "04",
    title: "Complete",
    description:
      "Track your progress and receive an eligible completion record after requirements are verified.",
  },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link href="/dashboard" className="text-lg font-bold tracking-wide">
            COREVIA <span className="text-cyan-400">ACADEMY</span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-transparent to-blue-500/10" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
            A Corevia Network learning initiative
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-6xl">
            Connect. Learn. Grow.
            <span className="mt-3 block text-cyan-300">
              Build skills for your future.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Explore a future learning platform designed to help people develop
            digital skills, understand business, build practical knowledge, and
            discover education and training opportunities.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="#learning-areas"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Learning Areas
            </a>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              Return to Network
            </Link>
          </div>
          <p className="mt-6 text-sm text-amber-200">
            Academy development in progress — course enrollment is not yet open.
          </p>
        </div>
      </section>

      <section
        id="learning-areas"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
            Learning areas
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Knowledge for a changing world
          </h2>
          <p className="mt-4 leading-7 text-slate-300">
            The planned catalogue covers foundational, professional, and
            practical learning. Individual courses will be published when their
            materials, requirements, and delivery arrangements are ready.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.number}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-400/50 hover:bg-white/[0.07]"
            >
              <p className="text-sm font-bold tracking-widest text-cyan-300">
                {category.number}
              </p>
              <h3 className="mt-4 text-xl font-bold">{category.title}</h3>
              <p className="mt-3 min-h-20 leading-7 text-slate-300">
                {category.description}
              </p>
              <div className="mt-5 border-t border-white/10 pt-4">
                <span className="text-sm font-semibold text-amber-200">
                  Preparation in progress
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Planned learning experience
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Learn, practise, demonstrate your skills
            </h2>
            <p className="mt-4 leading-7 text-slate-300">
              The intended platform will support structured learning and
              progress tracking, with assessments and completion records
              according to each course&apos;s requirements.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {learningSteps.map((step) => (
              <article
                key={step.number}
                className="rounded-xl border border-white/10 bg-slate-950 p-5"
              >
                <p className="text-sm font-bold text-cyan-300">
                  STEP {step.number}
                </p>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-6 sm:p-9">
          <h2 className="text-2xl font-bold">Learning with integrity</h2>
          <p className="mt-4 max-w-4xl leading-7 text-slate-300">
            Any completion certificate will depend on verified completion and
            the applicable assessment requirements. A Corevia Academy
            completion record will not, by itself, represent an accredited
            academic qualification or professional licence. Qualifications
            requiring an authorized institution or regulator must be provided
            through the appropriate recognized body.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>Corevia Academy · Building Trust Through Excellence.</p>
          <Link
            href="/dashboard"
            className="font-semibold text-cyan-300 hover:text-cyan-200"
          >
            Back to Corevia Network
          </Link>
        </div>
      </footer>
    </main>
  );
}
