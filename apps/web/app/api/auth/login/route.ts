import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { verifyPassword, createSessionToken, isEmailVerified } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing credentials" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password_hash) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 400 }
    );
  }

  // Optionally require email verification, controlled by env.
  const verified = await isEmailVerified(user.email);
  if (!verified && process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
    return NextResponse.json(
      { error: "Please verify your email first" },
      { status: 403 }
    );
  }

  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
