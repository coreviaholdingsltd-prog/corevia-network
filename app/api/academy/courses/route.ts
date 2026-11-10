import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { ACADEMY_COURSES } from "@/lib/academy-catalog";
import { buildAcademyPathwayCourses } from "@/lib/academy-pathways";

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

    const baseCourses = ACADEMY_COURSES.filter((course) => course.published && !course.isProgrammeStage);
    const publishedCourses = [
      ...baseCourses,
      ...buildAcademyPathwayCourses(baseCourses),
    ];
    const verifiedReferences = await prisma.academyAcademicReference.findMany({
      where: { courseId: { in: publishedCourses.map((course) => course.id) }, verified: true },
      select: { id: true, courseId: true, stageKey: true, title: true, authors: true, publication: true, publicationYear: true, url: true, doi: true, sourceType: true },
      orderBy: [{ publicationYear: "desc" }, { title: "asc" }],
    });

    const academicSignoffs = await prisma.academyAcademicSignoff.findMany({
      where: { courseId: { in: publishedCourses.filter((course) => course.isProgrammeStage).map((course) => course.id) } },
      select: { courseId: true, stageKey: true, decision: true, signedAt: true },
      orderBy: [{ signedAt: "desc" }, { createdAt: "desc" }],
    });

    const courses = publishedCourses.map((course) => {
      const enrollment = enrollments.find((item) => item.courseId === course.id);
      const unlocked = !!enrollment && (enrollment.status === "ACTIVE" || enrollment.status === "COMPLETED");
      const completedIds = new Set(enrollment?.lessonProgress.map((item) => item.lessonId) ?? []);
      const completedLessons = course.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
      const latest = enrollment?.attempts[0];
      const stageKey = course.isProgrammeStage
        ? String(course.programmeLevel ?? "FOUNDATION").toUpperCase().replace(/[^A-Z0-9]+/g, "_")
        : "SHORT_COURSE";
      const latestSignoff = course.isProgrammeStage
        ? academicSignoffs.find((item) => item.courseId === course.id && item.stageKey === stageKey)
        : undefined;
      const verifiedReferenceCount = course.isProgrammeStage
        ? verifiedReferences.filter((item) => item.courseId === course.id && item.stageKey === stageKey).length
        : 0;
      const academicReviewLocked = Boolean(
        course.isProgrammeStage &&
        !unlocked &&
        (latestSignoff?.decision !== "APPROVED" || verifiedReferenceCount < 3),
      );
      const prerequisiteLocked = Boolean(
        course.prerequisiteCourseId &&
        !enrollments.some((item) => item.courseId === course.prerequisiteCourseId && item.status === "COMPLETED"),
      );
      return {
        id: course.id,
        title: course.title,
        category: course.category,
        description: course.description,
        level: course.level,
        priceKsh: course.priceKsh,
        enrolled: unlocked,
        enrollmentStatus: enrollment?.status ?? null,
        isProgrammeStage: course.isProgrammeStage ?? false,
        pathwayId: course.pathwayId ?? null,
        programmeLevel: course.programmeLevel ?? null,
        programmeOrder: course.programmeOrder ?? null,
        prerequisiteCourseId: course.prerequisiteCourseId ?? null,
        prerequisiteTitle: course.prerequisiteCourseId ? publishedCourses.find((item) => item.id === course.prerequisiteCourseId)?.title ?? null : null,
        locked: prerequisiteLocked || academicReviewLocked,
        academicApprovalStatus: course.isProgrammeStage ? latestSignoff?.decision ?? "PENDING" : null,
        academicReviewLocked,
        verifiedReferenceCount,
        lessonsCount: course.lessons.length,
        questionsCount: course.questions.length,
        completedLessons,
        progressPercent: enrollment?.completion ? 100 : Math.round((completedLessons / course.lessons.length) * 100),
        lessons: unlocked ? course.lessons.map((lesson) => ({ ...lesson, completed: completedIds.has(lesson.id) })) : [],
        questions: unlocked ? course.questions.map(({ id, prompt, options }) => ({ id, prompt, options })) : [],
        latestAttempt: latest ? { score: latest.score, totalQuestions: latest.totalQuestions, passed: latest.passed, createdAt: latest.createdAt } : null,
        completion: enrollment?.completion ? { certificateCode: enrollment.completion.certificateCode, issuedAt: enrollment.completion.issuedAt } : null,
        references: verifiedReferences.filter((reference) =>
          reference.courseId === course.id && reference.stageKey === stageKey
        ),
      };
    });

    return NextResponse.json({ status: true, user: { name: user.name }, courses });
  } catch (error) {
    console.error("Academy courses error:", error);
    return NextResponse.json({ error: "Unable to load Academy courses." }, { status: 500 });
  }
}
