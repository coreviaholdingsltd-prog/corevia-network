import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAcademyUser } from "@/lib/academy-auth";

export const runtime = "nodejs";
type Context = { params: Promise<{ itemId: string }> };

export async function DELETE(_request: Request, context: Context) {
  try {
    const user = await getAcademyUser();
    if (!user) return NextResponse.json({ error: "Please sign in to manage your projects." }, { status: 401 });
    const { itemId } = await context.params;
    const result = await prisma.portfolioItem.deleteMany({
      where: { id: itemId, profile: { userId: user.id } },
    });
    if (result.count !== 1) return NextResponse.json({ error: "Portfolio project not found." }, { status: 404 });
    return NextResponse.json({ status: true, message: "Project removed from your portfolio." });
  } catch (error) {
    console.error("Portfolio project delete failed:", error);
    return NextResponse.json({ error: "Unable to remove this project right now." }, { status: 500 });
  }
}
