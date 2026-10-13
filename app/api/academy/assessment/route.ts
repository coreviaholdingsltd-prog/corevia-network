import crypto from "crypto";
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
    const course = findAcademyCourse(courseId);
    if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });
    const enrollment = await prisma.academyEnrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
      include: { lessonProgress: true, completion: true },
    });
    if (!enrollment || (enrollment.status !== "ACTIVE" && enrollment.status !== "COMPLETED")) {
      return NextResponse.json({ error: "Enroll in this course before taking the assessment." }, { status: 403 });
    }
    if (enrollment.status === "COMPLETED" && enrollment.completion) {
      return NextResponse.json({ status: true, passed: true, alreadyCompleted: true, score: 100, totalQuestions: course.questions.length, completion: { certificateCode: enrollment.completion.certificateCode, issuedAt: enrollment.completion.issuedAt } });
    }
    const completedIds = new Set(enrollment.lessonProgress.map((item) => item.lessonId));
    if (!course.lessons.every((lesson) => completedIds.has(lesson.id))) {
      return NextResponse.json({ error: "Complete every lesson before starting the final assessment." }, { status: 400 });
    }

    const answers = body.answers as Record<string, unknown> | undefined;
    if (!answers || typeof answers !== "object") return NextResponse.json({ error: "Submit an answer for every assessment question." }, { status: 400 });
    for (const question of course.questions) {
      const value = answers[question.id];
      if (!Number.isInteger(value) || Number(value) < 0 || Number(value) >= question.options.length) {
        return NextResponse.json({ error: "Answer every question before submitting." }, { status: 400 });
      }
    }

    const correct = course.questions.filter((question) => Number(answers[question.id]) === question.answerIndex).length;
    const score = Math.round((correct / course.questions.length) * 100);
    const passed = score >= 75;
    const review = course.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      chosenIndex: Number(answers[question.id]),
      correctIndex: question.answerIndex,
      correct: Number(answers[question.id]) === question.answerIndex,
      explanation: question.explanation,
    }));

    const result = await prisma.$transaction(async (tx) => {
      await tx.academyAssessmentAttempt.create({ data: { enrollmentId: enrollment.id, score, totalQuestions: course.questions.length, passed } });
      let completion = enrollment.completion;
      if (passed && !completion) {
        completion = await tx.academyCompletion.create({
          data: {
            enrollmentId: enrollment.id,
            certificateCode: `CVA-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
          },
        });
      }
      if (passed) {
        await tx.academyEnrollment.update({ where: { id: enrollment.id }, data: { status: "COMPLETED", completedAt: completion?.issuedAt ?? new Date() } });
      }
      return completion;
    });

    return NextResponse.json({
      status: true,
      passed,
      score,
      totalQuestions: course.questions.length,
      threshold: 75,
      message: passed ? "Assessment passed. Your Academy completion record is ready." : "Not passed yet. Review the explanations and try again.",
      review,
      completion: result ? { certificateCode: result.certificateCode, issuedAt: result.issuedAt } : null,
    });
  } catch (error) {
    console.error("Academy assessment error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to grade the assessment." }, { status: 500 });
  }
}
