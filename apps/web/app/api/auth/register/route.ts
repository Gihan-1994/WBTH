import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { hashPassword, createEmailVerificationToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }

  const password_hash = await hashPassword(password);

  // Validate role against allowed values (basic check, though Zod on frontend handles it too)
  const allowedRoles = ["tourist", "guide", "accommodation_provider"];
  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      role,
    },
  });

  await createEmailVerificationToken(email);

  return NextResponse.json({ ok: true });
}
