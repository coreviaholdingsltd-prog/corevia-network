import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export const runtime = "nodejs";

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const submissions = await prisma.academyProjectSubmission.findMany({
      where: { enrollment: { userId: user.id } },
      orderBy: { submittedAt: "desc" },
      include: { reviews: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    return NextResponse.json({
      status: true,
      submissions: submissions.map((item) => ({
        id: item.id,
        courseId: item.courseId,
        courseTitle: findAcademyCourse(item.courseId)?.title ?? item.courseId,
        projectTitle: item.projectTitle,
        status: item.status,
        submittedAt: item.submittedAt,
        latestReview: item.reviews[0] ? {
          totalScore: item.reviews[0].totalScore,
          feedback: item.reviews[0].feedback,
          decision: item.reviews[0].decision,
          createdAt: item.reviews[0].createdAt,
        } : null,
      })),
    });
  } catch (error) {
    console.error("Academy project list error:", error);
    return NextResponse.json({ error: "Unable to load project submissions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid project submission." }, { status: 400 });

    const courseId = text(body.courseId, 120);
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Published course not found." }, { status: 404 });

    const projectTitle = text(body.projectTitle, 180);
    const objective = text(body.objective, 5000);
    const methodology = text(body.methodology, 8000);
    const workDescription = text(body.workDescription, 12000);
    const reflection = text(body.reflection, 5000);
    const evidenceUrls = Array.isArray(body.evidenceUrls)
      ? body.evidenceUrls.filter((item: unknown): item is string => typeof item === "string")
          .map((url: string) => url.trim()).filter((url: string) => /^https:\/\//i.test(url)).slice(0, 8)
      : [];
    const originalityConfirmed = body.originalityConfirmed === true;

    if (!projectTitle || objective.length < 40 || methodology.length < 60 || workDescription.length < 100 || reflection.length < 40) {
      return NextResponse.json({ error: "Provide a clear project title, objective, method, substantial work description and reflection before submitting." }, { status: 400 });
    }
    if (!originalityConfirmed) return NextResponse.json({ error: "Confirm that the submission is your own work and that all external material is acknowledged." }, { status: 400 });

    const enrollment = await prisma.academyEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: {
        lessonProgress: true,
        attempts: { orderBy: { createdAt: "desc" }, take: 1 },
        completion: true,
      },
    });
    if (!enrollment || enrollment.status !== "ACTIVE" || enrollment.completion) {
      return NextResponse.json({ error: "An active, unfinished course enrolment is required before project submission." }, { status: 403 });
    }
    if (!course.lessons.every((lesson) => enrollment.lessonProgress.some((item) => item.lessonId === lesson.id))) {
      return NextResponse.json({ error: "Complete all course lessons before submitting the practical project." }, { status: 400 });
    }
    if (!enrollment.attempts[0]?.passed) {
      return NextResponse.json({ error: "Pass the course knowledge assessment before submitting the practical project." }, { status: 400 });
    }

    const pending = await prisma.academyProjectSubmission.findFirst({
      where: { enrollmentId: enrollment.id, status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
      select: { id: true },
    });
    if (pending) {
      return NextResponse.json({ error: "Your project is already awaiting academic review. Wait for feedback before submitting again." }, { status: 409 });
    }

    const revision = await prisma.academyProjectSubmission.findFirst({
      where: { enrollmentId: enrollment.id, status: "REVISION_REQUIRED" },
      orderBy: { submittedAt: "desc" },
    });
    const submission = revision
      ? await prisma.academyProjectSubmission.update({
          where: { id: revision.id },
          data: {
            projectTitle, objective, methodology, workDescription, reflection,
            evidenceUrls, originalityConfirmed, status: "SUBMITTED", submittedAt: new Date(),
          },
        })
      : await prisma.academyProjectSubmission.create({
          data: {
            enrollmentId: enrollment.id, courseId, projectTitle, objective,
            methodology, workDescription, reflection, evidenceUrls, originalityConfirmed,
          },
        });

    return NextResponse.json({ status: true, submission: { id: submission.id, status: submission.status, submittedAt: submission.submittedAt }, message: "Your practical project has been submitted for academic review." }, { status: 201 });
  } catch (error) {
    console.error("Academy project submission error:", error);
    return NextResponse.json({ error: "Unable to submit the practical project." }, { status: 500 });
  }
}
