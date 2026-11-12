import test from "node:test";
import assert from "node:assert/strict";
import { validateAcademyCoursePayment } from "../lib/academy-payment-guard.mjs";

const stored = {
  provider: "PAYSTACK",
  providerReference: "CV-ACADEMY-TEST-001",
  userId: "member-1",
  courseId: "computer-office-skills",
  enrollmentId: "enrol-1",
  amount: 1500,
};
const payment = {
  reference: stored.providerReference,
  amount: 150000,
  currency: "KES",
  status: "success",
  metadata: {
    purpose: "COREVIA_ACADEMY_COURSE",
    userId: stored.userId,
    courseId: stored.courseId,
    enrollmentId: stored.enrollmentId,
  },
};

test("accepts a matching successful KES course payment", () => {
  assert.equal(validateAcademyCoursePayment(payment, stored, stored.userId), true);
});

test("rejects unsuccessful, non-KES, or mismatched-amount payments", () => {
  assert.throws(() => validateAcademyCoursePayment({ ...payment, status: "pending" }, stored), /not successful/);
  assert.throws(() => validateAcademyCoursePayment({ ...payment, currency: "USD" }, stored), /KES/);
  assert.throws(() => validateAcademyCoursePayment({ ...payment, amount: 149900 }, stored), /amount/);
});

test("rejects another member, course, enrollment, provider, or payment purpose", () => {
  assert.throws(() => validateAcademyCoursePayment(payment, stored, "member-2"), /another member/);
  assert.throws(() => validateAcademyCoursePayment({ ...payment, metadata: { ...payment.metadata, courseId: "other" } }, stored), /metadata/);
  assert.throws(() => validateAcademyCoursePayment({ ...payment, metadata: { ...payment.metadata, enrollmentId: "other" } }, stored), /metadata/);
  assert.throws(() => validateAcademyCoursePayment({ ...payment, metadata: { ...payment.metadata, purpose: "MEMBERSHIP" } }, stored), /purpose/);
  assert.throws(() => validateAcademyCoursePayment(payment, { ...stored, provider: "OTHER" }), /provider/);
});

test("rejects references that do not match the reserved payment", () => {
  assert.throws(() => validateAcademyCoursePayment({ ...payment, reference: "attacker-ref" }, stored), /reference/);
});
