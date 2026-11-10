import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    const body = await request.json();
    const courseId = String(body.courseId ?? "");
    const lessonId = String(body.lessonId ?? "");
    const course = findAcademyCourse(courseId);
    if (!course || !course.lessons.some((lesson) => lesson.id === lessonId)) {
      return NextResponse.json({ error: "Course or lesson not found." }, { status: 404 });
    }
    const enrollment = await prisma.academyEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    });
    if (!enrollment || (enrollment.status !== "ACTIVE" && enrollment.status !== "COMPLETED")) {
      return NextResponse.json({ error: "Enroll in this course before marking lessons complete." }, { status: 403 });
    }
    if (enrollment.status === "COMPLETED") {
      return NextResponse.json({ status: true, alreadyCompleted: true });
    }

    // Enforce the published lesson order on the server, not only in the UI.
    // A learner may revisit an already-completed lesson, but cannot skip ahead.
    const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    const previousLessonIds = course.lessons.slice(0, lessonIndex).map((lesson) => lesson.id);
    if (previousLessonIds.length > 0) {
      const completedPrevious = await prisma.academyLessonProgress.findMany({
        where: { enrollmentId: enrollment.id, lessonId: { in: previousLessonIds } },
        select: { lessonId: true },
      });
      const completedPreviousIds = new Set(completedPrevious.map((item) => item.lessonId));
      const missingPrevious = previousLessonIds.filter((id) => !completedPreviousIds.has(id));
      if (missingPrevious.length > 0) {
        return NextResponse.json({
          error: "Complete the earlier lessons in order before marking this lesson complete.",
          requiredLessonId: missingPrevious[0],
        }, { status: 409 });
      }
    }

    await prisma.academyLessonProgress.upsert({
      where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId } },
      create: { enrollmentId: enrollment.id, lessonId },
      update: { completedAt: new Date() },
    });
    const completedLessons = await prisma.academyLessonProgress.count({ where: { enrollmentId: enrollment.id } });
    return NextResponse.json({ status: true, completedLessons, totalLessons: course.lessons.length, progressPercent: Math.round((completedLessons / course.lessons.length) * 100) });
  } catch (error) {
    console.error("Academy lesson progress error:", error);
    return NextResponse.json({ error: "Unable to save lesson progress." }, { status: 500 });
  }
}
