import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export async function GET(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to view course references." }, { status: 401 });
    const params = new URL(request.url).searchParams;
    const courseId = params.get("courseId")?.trim() ?? "";
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Published course not found." }, { status: 404 });
    const stageKey = course.isProgrammeStage
      ? String(course.programmeLevel ?? "FOUNDATION").toUpperCase().replace(/[^A-Z0-9]+/g, "_")
      : "SHORT_COURSE";
    const references = await prisma.academyAcademicReference.findMany({
      where: { courseId, stageKey, verified: true },
      orderBy: [{ publicationYear: "desc" }, { title: "asc" }],
      select: { id: true, title: true, authors: true, publication: true, publicationYear: true, url: true, doi: true, sourceType: true, verifiedAt: true },
    });
    return NextResponse.json({ status: true, courseId, stageKey, references });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2021") {
      console.error("Academy reference table is not migrated yet; returning no verified references.");
      return NextResponse.json({ status: true, courseId: new URL(request.url).searchParams.get("courseId"), stageKey: null, references: [] });
    }
    console.error("Academy references error:", error);
    return NextResponse.json({ error: "Unable to load verified references." }, { status: 500 });
  }
}
