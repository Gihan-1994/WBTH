import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma/src/client";
import { hashPassword, createEmailVerificationToken } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      // role will use your default, e.g. "tourist"
    },
  });

  await createEmailVerificationToken(email);

  return NextResponse.json({ ok: true });
}
