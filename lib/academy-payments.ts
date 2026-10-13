import { prisma } from "@/lib/prisma";

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

  return prisma.$transaction(async (tx) => {
    const current = await tx.academyPayment.findUnique({
      where: { providerReference: reference },
      include: { enrollment: true },
    });
    if (!current) throw new Error("Academy payment record disappeared.");
    if (current.status === "COMPLETED") {
      return { alreadyProcessed: true, courseId: current.courseId, enrollmentId: current.enrollmentId };
    }

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

    return { alreadyProcessed: false, courseId: current.courseId, enrollmentId: current.enrollmentId };
  });
}
