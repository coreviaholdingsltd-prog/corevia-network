import { prisma } from "@/lib/prisma";
import { validateAcademyCoursePayment } from "@/lib/academy-payment-guard.mjs";

export async function processAcademyCoursePayment(
  payment: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    paid_at?: string | null;
    metadata?: Record<string, unknown> | null;
  },
  expectedUserId?: string,
) {
  const reference = String(payment.reference ?? "").trim();
  if (!reference) throw new Error("Course payment reference is missing.");

  const stored = await prisma.academyPayment.findUnique({
    where: { providerReference: reference },
  });
  if (!stored) throw new Error("Academy payment reference was not found.");
  validateAcademyCoursePayment(payment, stored, expectedUserId);

  const paidAt = payment.paid_at && !Number.isNaN(Date.parse(payment.paid_at))
    ? new Date(payment.paid_at)
    : new Date();

  return prisma.$transaction(async (tx) => {
    // Serialize webhook and browser-return verification for this reference.
    // The unique ledger reference below makes revenue recognition idempotent.
    const locked = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT "id" FROM "AcademyPayment"
      WHERE "providerReference" = ${reference}
      FOR UPDATE
    `;
    if (locked.length !== 1) throw new Error("Academy payment could not be locked.");

    const current = await tx.academyPayment.findUnique({
      where: { providerReference: reference },
      include: { enrollment: true },
    });
    if (!current) throw new Error("Academy payment record disappeared.");
    validateAcademyCoursePayment(payment, current, expectedUserId);

    if (current.status !== "COMPLETED") {
      await tx.academyPayment.update({
        where: { id: current.id },
        data: { status: "COMPLETED", verifiedAt: paidAt },
      });
      await tx.academyEnrollment.update({
        where: { id: current.enrollmentId },
        data: {
          status: current.enrollment.status === "COMPLETED" ? "COMPLETED" : "ACTIVE",
          amountPaid: current.amount,
        },
      });
    }

    await tx.ledgerEntry.upsert({
      where: { reference: `ACADEMY-COURSE-${reference}-COREVIA` },
      create: {
        ownerType: "COREVIA",
        amount: current.amount,
        type: "ACADEMY_COURSE_PAYMENT",
        reference: `ACADEMY-COURSE-${reference}-COREVIA`,
        description: `Verified Corevia Academy course revenue for ${current.courseId}; Paystack reference ${reference}`,
      },
      update: {},
    });

    return {
      alreadyProcessed: current.status === "COMPLETED",
      courseId: current.courseId,
      enrollmentId: current.enrollmentId,
    };
  });
}
