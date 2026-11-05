import { prisma } from "@/lib/prisma";
import { dispatchCoreviaRevenueTransfers } from "@/lib/paystack/revenue-transfers";

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
  if (payment.status !== "success") throw new Error("Course payment is not successful.");
  if (payment.currency !== "KES") throw new Error("Course payment must be in KES.");
  const reference = String(payment.reference ?? "").trim();
  if (!reference) throw new Error("Course payment reference is missing.");
  if (payment.metadata?.purpose !== "COREVIA_ACADEMY_COURSE") {
    throw new Error("Payment purpose is not a Corevia Academy course.");
  }

  const stored = await prisma.academyPayment.findUnique({
    where: { providerReference: reference },
    include: { enrollment: true },
  });
  if (!stored) throw new Error("Academy payment reference was not found.");
  if (expectedUserId && stored.userId !== expectedUserId) throw new Error("This payment belongs to another member.");
  if (payment.metadata?.userId !== stored.userId || payment.metadata?.courseId !== stored.courseId || payment.metadata?.enrollmentId !== stored.enrollmentId) {
    throw new Error("Course payment metadata does not match the saved enrollment.");
  }
  if (Number(payment.amount) !== Math.round(Number(stored.amount) * 100)) {
    throw new Error("Course payment amount does not match the enrolled course fee.");
  }
  if (stored.status === "COMPLETED") {
    return { alreadyProcessed: true, courseId: stored.courseId, enrollmentId: stored.enrollmentId };
  }

  const paidAt = payment.paid_at && !Number.isNaN(Date.parse(payment.paid_at))
    ? new Date(payment.paid_at)
    : new Date();

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.academyPayment.findUnique({
      where: { providerReference: reference },
      include: { enrollment: true },
    });
    if (!current) throw new Error("Academy payment record disappeared.");
    if (current.status === "COMPLETED") {
      return { alreadyProcessed: true, courseId: current.courseId, enrollmentId: current.enrollmentId };
    }

    const claimed = await tx.academyPayment.updateMany({
      where: { id: current.id, status: "PENDING" },
      data: { status: "COMPLETED", verifiedAt: paidAt },
    });
    if (claimed.count !== 1) {
      return { alreadyProcessed: true, courseId: current.courseId, enrollmentId: current.enrollmentId };
    }
    await tx.ledgerEntry.create({
      data: {
        ownerType: "COREVIA",
        amount: current.amount,
        type: "ADJUSTMENT",
        reference: `ACADEMY-${reference}-COREVIA`,
        description: `Corevia Academy course fee revenue for course ${current.courseId}`,
      },
    });

    await tx.academyEnrollment.update({
      where: { id: current.enrollmentId },
      data: {
        status: current.enrollment.status === "COMPLETED" ? "COMPLETED" : "ACTIVE",
        amountPaid: current.amount,
      },
    });

    return { alreadyProcessed: false, courseId: current.courseId, enrollmentId: current.enrollmentId };
  });

  if (!result.alreadyProcessed) {
    try {
      await dispatchCoreviaRevenueTransfers();
    } catch (error) {
      // Revenue remains in the Corevia ledger and is retried by the Paystack
      // reconciliation cron; a course activation must not be rolled back.
      console.error("Corevia Academy revenue transfer dispatch deferred:", error);
    }
  }
  return result;
}
