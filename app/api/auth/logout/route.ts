import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({
    status: true,
    message: "Signed out successfully.",
  });

  response.cookies.set({
    name: sessionCookieName,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}