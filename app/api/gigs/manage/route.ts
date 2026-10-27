import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";
const configuredModerators = (process.env.COREVIA_GIGS_MODERATOR_EMAILS || "")
  .split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
const isModeratorEmail = (email: string) => ["coreviaholdingsltd@gmail.com", ...configuredModerators].includes(email.toLowerCase());
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function GET() {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to manage gigs." }, { status: 401 });
    const isModerator = isModeratorEmail(user.email);
    const [postedGigs, myApplications, pendingGigs] = await Promise.all([
      prisma.gig.findMany({
        where: { ownerId: user.id }, orderBy: { createdAt: "desc" }, take: 60,
        include: {
          applications: { orderBy: { createdAt: "desc" }, take: 100, include: { applicant: { select: { id: true, name: true } } } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.gigApplication.findMany({
        where: { applicantId: user.id }, orderBy: { createdAt: "desc" }, take: 100,
        include: { gig: { select: { id: true, title: true, status: true, category: true, workMode: true, budgetKsh: true, budgetType: true, owner: { select: { name: true } } } } },
      }),
      isModerator ? prisma.gig.findMany({
        where: { status: "PENDING_REVIEW" }, orderBy: { createdAt: "asc" }, take: 100,
        include: { owner: { select: { id: true, name: true } }, _count: { select: { applications: true } } },
      }) : Promise.resolve([]),
    ]);
    return NextResponse.json({ status: true, isModerator, postedGigs, myApplications, pendingGigs });
  } catch (error) {
    console.error("Gigs management load failed:", error);
    return NextResponse.json({ error: "Unable to load your gigs. Check that the Gigs database migration has been applied." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid Gigs action." }, { status: 400 }); }
    const action = text(body.action);
    const gigId = text(body.gigId);
    if (!gigId) return NextResponse.json({ error: "Missing gig ID." }, { status: 400 });

    if (action === "moderate") {
      if (!isModeratorEmail(user.email)) return NextResponse.json({ error: "Only authorised Corevia moderators can review listings." }, { status: 403 });
      const status = text(body.status);
      if (status !== "OPEN" && status !== "REJECTED") return NextResponse.json({ error: "Invalid review decision." }, { status: 400 });
      const result = await prisma.gig.updateMany({ where: { id: gigId, status: "PENDING_REVIEW" }, data: { status } });
      if (result.count !== 1) return NextResponse.json({ error: "This listing is no longer awaiting review." }, { status: 409 });
      return NextResponse.json({ status: true, message: status === "OPEN" ? "Gig approved and now public." : "Gig rejected." });
    }

    const gig = await prisma.gig.findUnique({ where: { id: gigId }, select: { id: true, ownerId: true, status: true } });
    if (!gig) return NextResponse.json({ error: "Gig not found." }, { status: 404 });
    if (action === "listing") {
      if (gig.ownerId !== user.id) return NextResponse.json({ error: "Only the gig owner can change this listing." }, { status: 403 });
      const status = text(body.status);
      if (status === "CLOSED" && (gig.status === "OPEN" || gig.status === "PAUSED")) {
        await prisma.gig.update({ where: { id: gigId }, data: { status: "CLOSED" } });
        return NextResponse.json({ status: true, message: "Gig closed." });
      }
      if (status === "OPEN" && gig.status === "CLOSED") {
        await prisma.gig.update({ where: { id: gigId }, data: { status: "OPEN" } });
        return NextResponse.json({ status: true, message: "Gig reopened." });
      }
      return NextResponse.json({ error: "That listing status change is not allowed." }, { status: 409 });
    }

    if (action === "application") {
      if (gig.ownerId !== user.id) return NextResponse.json({ error: "Only the gig owner can review applications." }, { status: 403 });
      const applicationId = text(body.applicationId);
      const status = text(body.status);
      if (!applicationId || !["SHORTLISTED", "ACCEPTED", "DECLINED"].includes(status)) return NextResponse.json({ error: "Choose shortlist, accept or decline for a valid application." }, { status: 400 });
      const application = await prisma.gigApplication.findFirst({ where: { id: applicationId, gigId }, select: { id: true } });
      if (!application) return NextResponse.json({ error: "Application not found for this gig." }, { status: 404 });
      if (status === "ACCEPTED") {
        await prisma.$transaction([
          prisma.gigApplication.updateMany({ where: { gigId, id: { not: applicationId }, status: { in: ["SUBMITTED", "SHORTLISTED"] } }, data: { status: "DECLINED" } }),
          prisma.gigApplication.update({ where: { id: applicationId }, data: { status: "ACCEPTED" } }),
        ]);
      } else {
        await prisma.gigApplication.update({ where: { id: applicationId }, data: { status: status as "SHORTLISTED" | "DECLINED" } });
      }
      return NextResponse.json({ status: true, message: "Application status updated." });
    }
    return NextResponse.json({ error: "Unknown Gigs action." }, { status: 400 });
  } catch (error) {
    console.error("Gigs management action failed:", error);
    return NextResponse.json({ error: "Unable to complete that action right now." }, { status: 500 });
  }
}
