import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma/src/client";
import { consumeEmailVerificationToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json(
      { error: "Invalid verification link" },
      { status: 400 }
    );
  }

  const ok = await consumeEmailVerificationToken(token, email);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // Mark user as verified in a simple way:
  // For this minimal version we DON'T add a new column,
  // we just say “no pending email-verify token” == verified.
  // (Your `isEmailVerified` helper already uses this logic.)

  // Optional: update some flag if you later add a column
  await prisma.user.update({
    where: { email },
    data: {}, // nothing for now
  });

  // Redirect to login with a small flag
  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
