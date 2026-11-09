import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyReviewer } from "@/lib/academy-review-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

const criteriaKeys = ["subjectAccuracy", "learningOutcomes", "sourceQuality", "assessmentValidity", "practicalRelevance", "ethicsAndSafety", "levelAppropriateness", "accessibility"];

export async function GET(request: Request) {
  try {
    const access = await getAcademyReviewer();
    if (access.response || !access.user) return NextResponse.json({ error: access.response?.error ?? "Reviewer access required." }, { status: access.response?.status ?? 403 });
    const courseId = new URL(request.url).searchParams.get("courseId")?.trim() ?? "";
    if (!courseId) return NextResponse.json({ error: "courseId is required." }, { status: 400 });
    const signoffs = await prisma.academyAcademicSignoff.findMany({ where: { courseId }, orderBy: { signedAt: "desc" }, take: 20 });
    return NextResponse.json({ status: true, signoffs });
  } catch {
    return NextResponse.json({ error: "Unable to load academic sign-offs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const access = await getAcademyReviewer();
    if (access.response || !access.user) return NextResponse.json({ error: access.response?.error ?? "Reviewer access required." }, { status: access.response?.status ?? 403 });
    const body = await request.json().catch(() => null);
    const courseId = typeof body?.courseId === "string" ? body.courseId.trim() : "";
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Published course not found." }, { status: 404 });
    const decision = body?.decision;
    if (!["APPROVED", "REVISION_REQUIRED", "REJECTED"].includes(decision)) return NextResponse.json({ error: "A valid academic decision is required." }, { status: 400 });
    const notes = typeof body?.notes === "string" ? body.notes.trim().slice(0, 10000) : "";
    const criteria = body?.criteria;
    if (notes.length < 80 || !criteria || typeof criteria !== "object") return NextResponse.json({ error: "Detailed reviewer notes and all eight academic criteria are required." }, { status: 400 });
    const checklist: Record<string, boolean> = {};
    for (const key of criteriaKeys) {
      if (typeof criteria[key] !== "boolean") return NextResponse.json({ error: "Every academic criterion must have an explicit true/false result." }, { status: 400 });
      checklist[key] = criteria[key];
    }
    const stageKey = course.isProgrammeStage
      ? String(course.programmeLevel ?? "FOUNDATION").toUpperCase().replace(/[^A-Z0-9]+/g, "_")
      : "SHORT_COURSE";
    const verifiedSources = await prisma.academyAcademicReference.count({ where: { courseId, stageKey, verified: true } });
    if (decision === "APPROVED" && (Object.values(checklist).some((value) => !value) || verifiedSources < 3)) {
      return NextResponse.json({ error: "Approval requires all eight criteria to pass and at least three verified subject references for this course and stage.", verifiedSources }, { status: 409 });
    }
    await prisma.academyAcademicReviewer.upsert({
      where: { email: access.user.email.toLowerCase() },
      create: { email: access.user.email.toLowerCase(), name: access.user.name },
      update: { name: access.user.name, active: true },
    });
    const signoff = await prisma.academyAcademicSignoff.create({
      data: { courseId, stageKey, reviewerEmail: access.user.email.toLowerCase(), reviewerName: access.user.name, decision, criteria: checklist, notes },
    });
    return NextResponse.json({ status: true, signoff: { id: signoff.id, courseId, stageKey, decision: signoff.decision, signedAt: signoff.signedAt }, verifiedSources }, { status: 201 });
  } catch (error) {
    console.error("Academy academic sign-off error:", error);
    return NextResponse.json({ error: "Unable to record academic sign-off." }, { status: 500 });
  }
}
