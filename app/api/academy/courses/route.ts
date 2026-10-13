import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { ACADEMY_COURSES } from "@/lib/academy-catalog";

export async function GET() {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to access Corevia Academy." }, { status: 401 });

    const enrollments = await prisma.academyEnrollment.findMany({
      where: { userId: user.id },
      include: {
        lessonProgress: true,
        attempts: { orderBy: { createdAt: "desc" }, take: 1 },
        completion: true,
      },
    });

    const courses = ACADEMY_COURSES.filter((course) => course.published).map((course) => {
      const enrollment = enrollments.find((item) => item.courseId === course.id);
      const unlocked = !!enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED");
      const completedIds = new Set(enrollment?.lessonProgress.map((item) => item.lessonId) ?? []);
      const completedLessons = course.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
      const latest = enrollment?.attempts[0];
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        description: course.description,
        level: course.level,
        priceKsh: course.priceKsh,
        enrolled: unlocked,
        enrollmentStatus: enrollment?.status ?? null,
        lessonsCount: course.lessons.length,
        completedLessons,
        progressPercent: Math.round((completedLessons / course.lessons.length) * 100),
        lessons: unlocked ? course.lessons.map((lesson) => ({ ...lesson, completed: completedIds.has(lesson.id) })) : [],
        questions: unlocked ? course.questions.map(({ id, prompt, options }) => ({ id, prompt, options })) : [],
        latestAttempt: latest ? { score: latest.score, totalQuestions: latest.totalQuestions, passed: latest.passed, createdAt: latest.createdAt } : null,
        completion: enrollment?.completion ? { certificateCode: enrollment.completion.certificateCode, issuedAt: enrollment.completion.issuedAt } : null,
      };
    });

    return NextResponse.json({ status: true, user: { name: user.name }, courses });
  } catch (error) {
    console.error("Academy courses error:", error);
    return NextResponse.json({ error: "Unable to load Academy courses." }, { status: 500 });
  }
}
