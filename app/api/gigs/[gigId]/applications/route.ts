import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ gigId: string }> };
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function POST(request: Request, context: Context) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to apply. Applying is free." }, { status: 401 });
    const { gigId } = await context.params;
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid application." }, { status: 400 }); }
    const proposal = text(body.proposal);
    const portfolioUrl = text(body.portfolioUrl);
    if (proposal.length < 30 || proposal.length > 2500) return NextResponse.json({ error: "Your proposal must be 30–2,500 characters." }, { status: 400 });
    if (portfolioUrl && (portfolioUrl.length > 500 || !/^https:\/\//i.test(portfolioUrl))) return NextResponse.json({ error: "Portfolio link must be an HTTPS URL." }, { status: 400 });

    const gig = await prisma.gig.findUnique({ where: { id: gigId }, select: { id: true, ownerId: true, status: true } });
    if (!gig) return NextResponse.json({ error: "This gig could not be found." }, { status: 404 });
    if (gig.status !== "OPEN") return NextResponse.json({ error: "This gig is no longer accepting applications." }, { status: 409 });
    if (gig.ownerId === user.id) return NextResponse.json({ error: "You cannot apply to your own gig." }, { status: 400 });
    const existing = await prisma.gigApplication.findUnique({ where: { gigId_applicantId: { gigId, applicantId: user.id } }, select: { id: true } });
    if (existing) return NextResponse.json({ error: "You have already applied to this gig." }, { status: 409 });

    const application = await prisma.gigApplication.create({ data: {
      gigId, applicantId: user.id, proposal, portfolioUrl: portfolioUrl || null,
    }, select: { id: true, status: true, createdAt: true } });
    return NextResponse.json({ status: true, application, message: "Application submitted. No application fee was charged." }, { status: 201 });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "You have already applied to this gig." }, { status: 409 });
    }
    console.error("Gig application failed:", error);
    return NextResponse.json({ error: "Unable to submit your application right now." }, { status: 500 });
  }
}
