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
