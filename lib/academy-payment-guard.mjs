export function validateAcademyCoursePayment(payment, stored, expectedUserId) {
  if (payment.status !== "success") throw new Error("Course payment is not successful.");
  if (String(payment.currency).toUpperCase() !== "KES") throw new Error("Course payment must be in KES.");
  if (!payment.reference || payment.reference !== stored.providerReference) throw new Error("Course payment reference does not match.");
  if (stored.provider !== "PAYSTACK") throw new Error("Course payment provider does not match.");
  if (expectedUserId && stored.userId !== expectedUserId) throw new Error("This payment belongs to another member.");
  if (payment.metadata?.purpose !== "COREVIA_ACADEMY_COURSE") throw new Error("Payment purpose is not a Corevia Academy course.");
  if (payment.metadata?.userId !== stored.userId || payment.metadata?.courseId !== stored.courseId || payment.metadata?.enrollmentId !== stored.enrollmentId) {
    throw new Error("Course payment metadata does not match the saved enrollment.");
  }
  if (Number(payment.amount) !== Math.round(Number(stored.amount) * 100)) {
    throw new Error("Course payment amount does not match the enrolled course fee.");
  }
  return true;
}
