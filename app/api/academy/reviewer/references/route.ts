import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyReviewer } from "@/lib/academy-review-auth";
import { findAcademyCourse } from "@/lib/academy-catalog";

export async function POST(request: Request) {
  try {
    const access = await getAcademyReviewer();
    if (access.response || !access.user) return NextResponse.json({ error: access.response?.error ?? "Reviewer access required." }, { status: access.response?.status ?? 403 });
    const body = await request.json().catch(() => null);
    const courseId = typeof body?.courseId === "string" ? body.courseId.trim() : "";
    const course = findAcademyCourse(courseId);
    if (!course || !course.published) return NextResponse.json({ error: "Published course not found." }, { status: 404 });

    const title = typeof body?.title === "string" ? body.title.trim().slice(0, 300) : "";
    const authors = typeof body?.authors === "string" ? body.authors.trim().slice(0, 500) : "";
    const publication = typeof body?.publication === "string" ? body.publication.trim().slice(0, 300) : "";
    const sourceType = typeof body?.sourceType === "string" ? body.sourceType.trim().toUpperCase() : "";
    const publicationYear = Number.isInteger(body?.publicationYear) ? body.publicationYear : null;
    const url = typeof body?.url === "string" ? body.url.trim() : null;
    const doi = typeof body?.doi === "string" ? body.doi.trim() : null;
    const verificationNotes = typeof body?.verificationNotes === "string" ? body.verificationNotes.trim().slice(0, 3000) : "";
    const allowedTypes = ["BOOK", "JOURNAL", "OFFICIAL_STANDARD", "OFFICIAL_DOCUMENT", "DATASET", "WEBSITE"];
    if (!title || !authors || !publication || !allowedTypes.includes(sourceType) || verificationNotes.length < 40) {
      return NextResponse.json({ error: "Provide complete bibliographic details, a supported source type and verification notes explaining the source's authority and relevance." }, { status: 400 });
    }
    if ((!url || !/^https:\/\//i.test(url)) && (!doi || !/^10\.\d{4,9}\//.test(doi))) {
      return NextResponse.json({ error: "A valid HTTPS source URL or DOI is required." }, { status: 400 });
    }
    if (publicationYear !== null && (publicationYear < 1450 || publicationYear > new Date().getFullYear() + 1)) {
      return NextResponse.json({ error: "Publication year is outside the accepted range." }, { status: 400 });
    }
    const stageKey = course.isProgrammeStage
      ? String(course.programmeLevel ?? "FOUNDATION").toUpperCase().replace(/[^A-Z0-9]+/g, "_")
      : "SHORT_COURSE";

    await prisma.academyAcademicReviewer.upsert({
      where: { email: access.user.email.toLowerCase() },
      create: { email: access.user.email.toLowerCase(), name: access.user.name },
      update: { name: access.user.name, active: true },
    });
    const reference = await prisma.academyAcademicReference.upsert({
      where: { courseId_stageKey_title: { courseId, stageKey, title } },
      create: { courseId, stageKey, title, authors, publication, publicationYear, url, doi, sourceType, verificationNotes, verified: true, verifiedBy: access.user.email.toLowerCase(), verifiedAt: new Date() },
      update: { authors, publication, publicationYear, url, doi, sourceType, verificationNotes, verified: true, verifiedBy: access.user.email.toLowerCase(), verifiedAt: new Date() },
    });
    return NextResponse.json({ status: true, reference: { id: reference.id, title: reference.title, stageKey, verified: reference.verified } }, { status: 201 });
  } catch (error) {
    console.error("Academy reference verification error:", error);
    return NextResponse.json({ error: "Unable to save the verified academic reference." }, { status: 500 });
  }
}
