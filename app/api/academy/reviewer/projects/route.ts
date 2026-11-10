import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyReviewer } from "@/lib/academy-review-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export const runtime = "nodejs";

export async function GET() {
  try {
    const access = await getAcademyReviewer();
    if (access.response) return NextResponse.json({ error: access.response.error }, { status: access.response.status });

    const submissions = await prisma.academyProjectSubmission.findMany({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED"] } },
      orderBy: { submittedAt: "asc" },
      include: {
        enrollment: { include: { user: { select: { name: true, email: true } }, attempts: { orderBy: { createdAt: "desc" }, take: 1 } } },
        reviews: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    return NextResponse.json({
      status: true,
      submissions: submissions.map((item) => ({
        id: item.id,
        courseId: item.courseId,
        courseTitle: findAcademyCourse(item.courseId)?.title ?? item.courseId,
        learner: item.enrollment.user.name,
        learnerEmail: item.enrollment.user.email,
        projectTitle: item.projectTitle,
        objective: item.objective,
        methodology: item.methodology,
        workDescription: item.workDescription,
        reflection: item.reflection,
        evidenceUrls: item.evidenceUrls,
        status: item.status,
        submittedAt: item.submittedAt,
        latestReview: item.reviews[0] ?? null,
      })),
    });
  } catch (error) {
    console.error("Academy reviewer queue error:", error);
    return NextResponse.json({ error: "Unable to load the review queue." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await getAcademyReviewer();
    if (access.response || !access.user) return NextResponse.json({ error: access.response?.error ?? "Reviewer access required." }, { status: access.response?.status ?? 403 });

    const body = await request.json().catch(() => null);
    const submissionId = typeof body?.submissionId === "string" ? body.submissionId.trim() : "";
    const feedback = typeof body?.feedback === "string" ? body.feedback.trim().slice(0, 10000) : "";
    const scores = body?.rubricScores;
    const dimensions = ["subjectKnowledge", "application", "evidenceAndMethod", "ethicsAndSafety", "communication"];
    if (!submissionId || feedback.length < 40 || !scores || typeof scores !== "object") {
      return NextResponse.json({ error: "Submission, detailed feedback and all five rubric scores are required." }, { status: 400 });
    }

    const rubricScores: Record<string, number> = {};
    for (const dimension of dimensions) {
      const score = scores[dimension];
      if (!Number.isInteger(score) || score < 0 || score > 20) {
        return NextResponse.json({ error: "Each rubric dimension must be an integer from 0 to 20." }, { status: 400 });
      }
      rubricScores[dimension] = score;
    }
    const totalScore = Object.values(rubricScores).reduce((sum, score) => sum + score, 0);
    const requestedDecision = body?.decision;
    if (!["APPROVED", "REVISION_REQUIRED", "REJECTED"].includes(requestedDecision)) {
      return NextResponse.json({ error: "Choose APPROVED, REVISION_REQUIRED or REJECTED." }, { status: 400 });
    }
    const decision = requestedDecision === "REJECTED"
      ? "REJECTED"
      : totalScore >= 75 && requestedDecision === "APPROVED"
        ? "APPROVED"
        : "REVISION_REQUIRED";
    if (requestedDecision === "APPROVED" && totalScore < 75) {
      return NextResponse.json({ error: "A project cannot be approved below the 75/100 practical assessment threshold." }, { status: 400 });
    }

    const submission = await prisma.academyProjectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        enrollment: {
          include: {
            attempts: { orderBy: { createdAt: "desc" }, take: 1 },
            completion: true,
          },
        },
      },
    });
    if (!submission) return NextResponse.json({ error: "Project submission not found." }, { status: 404 });
    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return NextResponse.json({ error: "This submission has a final decision. A new learner submission is required for further review." }, { status: 409 });
    }
    if (decision === "APPROVED" && !submission.enrollment.attempts[0]?.passed) {
      return NextResponse.json({ error: "The learner's latest knowledge assessment is not passed. Ask the learner to pass it again and resubmit before project approval." }, { status: 409 });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Compare-and-set the reviewable status so concurrent reviewers cannot
      // record conflicting final decisions for the same submission.
      const claimed = await tx.academyProjectSubmission.updateMany({
        where: { id: submissionId, status: { in: ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUIRED"] } },
        data: { status: decision },
      });
      if (claimed.count !== 1) {
        throw new Error("This project submission has already been reviewed. Refresh the review queue.");
      }
      const review = await tx.academyProjectReview.create({
        data: {
          submissionId,
          reviewerEmail: access.user!.email,
          reviewerName: access.user!.name,
          rubricScores,
          totalScore,
          feedback,
          decision,
        },
      });

      let completion = submission.enrollment.completion;
      if (decision === "APPROVED" && submission.enrollment.attempts[0]?.passed) {
        if (!completion) {
          completion = await tx.academyCompletion.create({
            data: {
              enrollmentId: submission.enrollmentId,
              certificateCode: `CVA-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
            },
          });
        }
        // Keep legacy completion records and enrollment status consistent.
        if (submission.enrollment.status !== "COMPLETED") {
          await tx.academyEnrollment.update({
            where: { id: submission.enrollmentId },
            data: { status: "COMPLETED", completedAt: completion.issuedAt },
          });
        }
      }
      return { review, completion };
    });

    return NextResponse.json({
      status: true,
      review: { id: result.review.id, totalScore, decision, createdAt: result.review.createdAt },
      completion: result.completion ? { certificateCode: result.completion.certificateCode, issuedAt: result.completion.issuedAt } : null,
      message: decision === "APPROVED" ? "Practical project approved. Course completion is recorded." : decision === "REJECTED" ? "Project rejected with reviewer feedback." : "Revision requested. The learner may submit improved work.",
    });
  } catch (error) {
    console.error("Academy project review error:", error);
    return NextResponse.json({ error: "Unable to record the project review." }, { status: 500 });
  }
}
