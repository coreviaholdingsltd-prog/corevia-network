import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { findAcademyCourse } from "@/lib/academy-catalog";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Verify a Certificate | Corevia Rise Academy",
  description: "Verify a Corevia Rise Academy certificate against its official completion record.",
};

type Props = { searchParams: Promise<{ code?: string | string[] }> };

export default async function VerifyPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = Array.isArray(params.code) ? params.code[0] : params.code;
  const code = typeof raw === "string" ? raw.trim().toUpperCase() : "";
  const validFormat = /^CVA-\d{4}-[A-F0-9]{8}$/.test(code);

  let record: { name:string; course:string; code:string; issued:Date } | null = null;

  if (validFormat) {
    const completion = await prisma.academyCompletion.findUnique({
      where: { certificateCode: code },
      include: { enrollment: { include: { user: { select: { name:true } } } } },
    });
    if (completion && completion.enrollment.status === "COMPLETED") {
      const course = findAcademyCourse(completion.enrollment.courseId);
      if (course?.published) {
        record = { name:completion.enrollment.user.name, course:course.title, code:completion.certificateCode, issued:completion.issuedAt };
      }
    }
  }

  const issued = record ? new Intl.DateTimeFormat("en-GB",{day:"2-digit",month:"long",year:"numeric",timeZone:"UTC"}).format(record.issued) : "";

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-4 py-12 text-[#12352c] sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/academy" className="text-sm font-semibold underline">Back to Corevia Rise Academy</Link>
        <header className="mt-8 rounded-3xl bg-[#12352c] p-8 text-white">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d6bd83]">COREVIA RISE ACADEMY</p>
          <h1 className="mt-3 text-3xl font-bold">Certificate Verification</h1>
          <p className="mt-3 leading-7 text-white/80">Check a certificate against the official course-completion database.</p>
        </header>

        <form action="/academy/verify" method="get" className="mt-6 rounded-2xl border bg-white p-6">
          <label htmlFor="code" className="block text-sm font-semibold">Certificate number</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input id="code" name="code" defaultValue={code} placeholder="CVA-2026-XXXXXXXX" spellCheck={false} className="min-w-0 flex-1 rounded-xl border px-4 py-3"/>
            <button type="submit" className="rounded-xl bg-[#12352c] px-6 py-3 font-bold text-white">Verify certificate</button>
          </div>
        </form>

        {record ? (
          <section className="mt-6 rounded-2xl border border-emerald-700/20 bg-white p-7" aria-live="polite">
            <p className="font-bold text-emerald-800">VERIFICATION STATUS: VALID</p>
            <h2 className="mt-2 text-2xl font-bold">Certificate verified</h2>
            <p className="mt-2 leading-7">The certificate number matches a completed course record.</p>
            <dl className="mt-6 grid gap-4 border-t pt-5 sm:grid-cols-2">
              <div><dt className="text-xs uppercase text-slate-500">Learner name</dt><dd className="mt-1 font-semibold">{record.name}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Course title</dt><dd className="mt-1 font-semibold">{record.course}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Certificate number</dt><dd className="mt-1 break-words font-semibold">{record.code}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Issue date</dt><dd className="mt-1 font-semibold">{issued}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs uppercase text-slate-500">Issuing company</dt><dd className="mt-1 font-semibold">COREVIA HOLDINGS LTD | COREVIA RISE ACADEMY</dd></div>
            </dl>
            <p className="mt-6 rounded-xl bg-[#f7f5ef] p-4 text-sm leading-6">Verification confirms a matching course-completion record. It does not itself establish external academic accreditation or professional licensing.</p>
          </section>
        ) : code ? (
          <section className="mt-6 rounded-2xl border bg-white p-6" role="status">
            <h2 className="text-xl font-bold">No matching certificate record</h2>
            <p className="mt-2 leading-7">Check the certificate number and try again. If the problem remains, contact Corevia Rise Academy.</p>
          </section>
        ) : (
          <p className="mt-6 rounded-2xl border bg-white p-6 leading-7">Enter the certificate number to check the learner, course, issue date, and verification status.</p>
        )}

        <footer className="mt-10 border-t py-6 text-center text-xs text-[#12352c]/60">COREVIA HOLDINGS LTD Â· Building Trust Through Excellence.</footer>
      </div>
    </main>
  );
}