import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";

const CATEGORIES = new Set([
  "Digital services",
  "Design & media",
  "Office & admin",
  "Technology",
  "Writing & research",
  "Marketing & sales",
  "Business support",
  "Other",
]);
const WORK_MODES = new Set(["REMOTE", "HYBRID", "ONSITE"]);
const BUDGET_TYPES = new Set(["FIXED", "HOURLY", "NEGOTIABLE"]);
const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = text(url.searchParams.get("q")).slice(0, 80);
    const category = text(url.searchParams.get("category"));
    const workMode = text(url.searchParams.get("workMode"));
    const where = {
      status: "OPEN" as const,
      ...(CATEGORIES.has(category) ? { category } : {}),
      ...(WORK_MODES.has(workMode) ? { workMode: workMode as "REMOTE" | "HYBRID" | "ONSITE" } : {}),
      ...(q ? { OR: [
        { title: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { category: { contains: q, mode: "insensitive" as const } },
      ] } : {}),
    };
    const gigs = await prisma.gig.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 60,
      select: {
        id: true, title: true, description: true, category: true, location: true,
        workMode: true, budgetKsh: true, budgetType: true, deadline: true, createdAt: true,
        owner: { select: { name: true } },
        _count: { select: { applications: true } },
      },
    });
    return NextResponse.json({ status: true, gigs: gigs.map((gig) => ({
      id: gig.id, title: gig.title, description: gig.description, category: gig.category,
      location: gig.location, workMode: gig.workMode, budgetKsh: gig.budgetKsh,
      budgetType: gig.budgetType, deadline: gig.deadline, createdAt: gig.createdAt,
      ownerName: gig.owner.name, applicationsCount: gig._count.applications,
    })) });
  } catch (error) {
    console.error("Public Gigs fetch failed:", error);
    return NextResponse.json({ error: "Gigs are temporarily unavailable. Please retry shortly." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to post a gig." }, { status: 401 });
    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid gig submission." }, { status: 400 }); }

    const title = text(body.title);
    const description = text(body.description);
    const category = text(body.category);
    const location = text(body.location);
    const workMode = text(body.workMode || "REMOTE");
    const budgetType = text(body.budgetType || "NEGOTIABLE");
    const rawBudget = body.budgetKsh;
    const budgetKsh = rawBudget === null || rawBudget === undefined || rawBudget === "" ? null : Number(rawBudget);
    const rawDeadline = text(body.deadline);
    const deadline = rawDeadline ? new Date(rawDeadline) : null;

    if (title.length < 5 || title.length > 100) return NextResponse.json({ error: "Gig title must be 5–100 characters." }, { status: 400 });
    if (description.length < 40 || description.length > 4000) return NextResponse.json({ error: "Description must be 40–4,000 characters and explain the deliverable." }, { status: 400 });
    if (!CATEGORIES.has(category)) return NextResponse.json({ error: "Choose a valid gig category." }, { status: 400 });
    if (location.length > 120) return NextResponse.json({ error: "Location must be 120 characters or fewer." }, { status: 400 });
    if (!WORK_MODES.has(workMode)) return NextResponse.json({ error: "Choose remote, hybrid or on-site work." }, { status: 400 });
    if (!BUDGET_TYPES.has(budgetType)) return NextResponse.json({ error: "Choose a valid budget type." }, { status: 400 });
    if (budgetKsh !== null && (!Number.isSafeInteger(budgetKsh) || budgetKsh < 0 || budgetKsh > 100000000)) return NextResponse.json({ error: "Enter a whole-number budget between KES 0 and KES 100,000,000, or leave it blank." }, { status: 400 });
    if (budgetType !== "NEGOTIABLE" && (budgetKsh === null || budgetKsh < 1)) return NextResponse.json({ error: "Provide a positive budget, or select Negotiable." }, { status: 400 });
    if (rawDeadline && (!deadline || Number.isNaN(deadline.getTime()) || deadline.getTime() <= Date.now())) return NextResponse.json({ error: "Deadline must be a valid future date." }, { status: 400 });

    const gig = await prisma.gig.create({ data: {
      ownerId: user.id, title, description, category, location: location || null,
      workMode: workMode as "REMOTE" | "HYBRID" | "ONSITE",
      budgetKsh: budgetType === "NEGOTIABLE" && budgetKsh === 0 ? null : budgetKsh,
      budgetType: budgetType as "FIXED" | "HOURLY" | "NEGOTIABLE",
      deadline, status: "PENDING_REVIEW",
    }, select: { id: true, title: true, status: true, createdAt: true } });
    return NextResponse.json({ status: true, gig, message: "Your gig has been submitted for Corevia review. It will be public after approval." }, { status: 201 });
  } catch (error) {
    console.error("Gig creation failed:", error);
    return NextResponse.json({ error: "Unable to submit this gig right now. Please try again." }, { status: 500 });
  }
}
