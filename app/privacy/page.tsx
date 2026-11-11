import Link from "next/link";

export const metadata = {
  title: "Privacy Notice | Corevia Network",
  description: "How Corevia Network handles member information and privacy choices.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-10 text-[#12352c]">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#12352c]/10 sm:p-10">
        <Link href="/" className="text-sm font-semibold underline">← Corevia Network</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#a88949]">Privacy and choice</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Privacy Notice</h1>
        <p className="mt-3 text-sm text-[#12352c]/60">Version 2026-11-10 · Last updated 10 November 2026</p>
        <p className="mt-6 leading-7">Corevia Network should collect only information needed to provide and protect its services. You decide what optional profile and portfolio information to publish. This notice explains the main information categories, their uses and the choices currently available.</p>

        <h2 className="mt-8 text-xl font-black">1. Information we collect</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 leading-7">
          <li><strong>Account information:</strong> name, email address, phone number and password hash. The phone number is currently requested to support M-PESA withdrawal requests; it is not displayed on public portfolios.</li>
          <li><strong>Service and transaction information:</strong> membership, wallet, payment, transfer and withdrawal records needed to operate accounts, reconcile transactions, prevent misuse and meet applicable recordkeeping obligations.</li>
          <li><strong>Information you choose to provide:</strong> portfolio biography, location, skills, professional links, work samples, gig listings, applications, Academy lesson progress and project submissions.</li>
          <li><strong>Technical and security information:</strong> information generated when you use the service, where needed to operate, secure and troubleshoot the platform.</li>
        </ul>

        <h2 className="mt-8 text-xl font-black">2. How we use information</h2>
        <p className="mt-3 leading-7">We use information to create and secure accounts, provide the requested Network features, process and reconcile payments, administer learning and gig workflows, respond to support requests, prevent fraud and comply with applicable obligations. We do not need optional biography, interests or portfolio details to authenticate your account.</p>

        <h2 className="mt-8 text-xl font-black">3. Public sharing is your choice</h2>
        <p className="mt-3 leading-7">A member portfolio is private by default for newly created profiles. If you deliberately enable “Publish my portfolio publicly” and save, anyone with its link can view your name, headline, biography, location, skills, professional links and published work samples. Your email, phone number, wallet and referral information are not included in the public portfolio. You can switch publication off in your portfolio settings; the public page will then be hidden.</p>
        <p className="mt-3 leading-7">Gig listings are intended to be visible to people browsing available work. When you apply, your proposal and portfolio link are made available to the owner of that gig for application review. Do not include information in a proposal or project sample that you do not want that recipient to see.</p>
        <p className="mt-3 leading-7">Academy submissions and evidence are provided for learning and review workflows. Submit only material you have permission to share. Access should be limited to the member and authorised reviewers or administrators who need it for that workflow.</p>

        <h2 className="mt-8 text-xl font-black">4. Payments and third-party services</h2>
        <p className="mt-3 leading-7">Payment details required to process transactions may be handled by payment providers such as Paystack under their own privacy terms. Corevia stores records needed to identify and reconcile transactions; do not send passwords, card security codes or one-time passcodes to Corevia support.</p>

        <h2 className="mt-8 text-xl font-black">5. Retention and security</h2>
        <p className="mt-3 leading-7">We retain information for as long as needed to provide the service, maintain account and transaction records, resolve disputes, protect the platform and meet applicable legal obligations. Financial records may need to be retained even after an account is closed. We apply access controls and technical safeguards, but no online service can promise absolute security.</p>

        <h2 className="mt-8 text-xl font-black">6. Your choices and requests</h2>
        <p className="mt-3 leading-7">You can choose whether to publish your portfolio and can remove portfolio projects you no longer want to display. You may request access to, correction of or deletion of personal information by contacting <a className="font-semibold underline" href="mailto:coreviaholdingsltd@gmail.com">coreviaholdingsltd@gmail.com</a>. We may need to verify your identity and may retain records where required for legal, security or financial reconciliation purposes. We will explain if a request cannot be fully completed.</p>

        <h2 className="mt-8 text-xl font-black">7. Contact</h2>
        <p className="mt-3 leading-7">For privacy questions or requests, contact Corevia Holdings Ltd at <a className="font-semibold underline" href="mailto:coreviaholdingsltd@gmail.com">coreviaholdingsltd@gmail.com</a> or +254 110 724 263.</p>
        <p className="mt-8 border-t border-[#12352c]/10 pt-5 text-sm leading-6 text-[#12352c]/60">This notice describes current platform features and is not a substitute for a jurisdiction-specific legal review. Corevia should review it as its services and data practices evolve.</p>
      </article>
    </main>
  );
}
