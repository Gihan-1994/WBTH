import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { hashPassword, createEmailVerificationToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    console.log('[REGISTER] Received registration request:', { name, email, role });

    if (!name || !email || !password || !role) {
      console.log('[REGISTER] Missing fields:', { name: !!name, email: !!email, password: !!password, role: !!role });
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Validate role against allowed values
    const allowedRoles = ["tourist", "guide", "accommodation_provider"];
    if (!allowedRoles.includes(role)) {
      console.log('[REGISTER] Invalid role:', role);
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    console.log('[REGISTER] Checking for existing user...');
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('[REGISTER] Email already exists:', email);
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    console.log('[REGISTER] Hashing password...');
    const password_hash = await hashPassword(password);

    console.log('[REGISTER] Creating user...');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role,
      },
    });
    console.log('[REGISTER] User created successfully:', user.id);

    console.log('[REGISTER] Creating email verification token...');
    try {
      await createEmailVerificationToken(email);
      console.log('[REGISTER] Email verification token created');
    } catch (emailError: any) {
      console.error('[REGISTER] Email verification token creation failed:', emailError.message);
      // Continue even if email verification fails
    }

    console.log('[REGISTER] Registration complete');
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('[REGISTER] Registration error:', error);
    console.error('[REGISTER] Error stack:', error.stack);
    console.error('[REGISTER] Error code:', error.code);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
