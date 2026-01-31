// apps/web/lib/auth.ts
import { prisma } from "@repo/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const EMAIL_VERIFY_PREFIX = "email-verify:";
const JWT_SECRET = process.env.JWT_SECRET!;
const APP_URL = process.env.NEXTAUTH_URL || "http://localhost:3000";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
};

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifySessionToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

// ---------- EMAIL VERIFICATION ----------

function createRandomToken() {
  return randomBytes(32).toString("hex");
}

export async function createEmailVerificationToken(email: string) {
  const token = createRandomToken();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: EMAIL_VERIFY_PREFIX + email,
      token,
      expires,
    },
  });

  const verifyUrl = `${APP_URL}/verify-email?token=${token}&email=${encodeURIComponent(
    email
  )}`;

  // DEV ONLY – in real app send email here
  console.log("[DEV] Email verification link:", verifyUrl);

  return { token, verifyUrl };
}

export async function consumeEmailVerificationToken(
  token: string,
  email: string
) {
  const record = await prisma.verificationToken.findFirst({
    where: {
      identifier: {
        equals: EMAIL_VERIFY_PREFIX + email,
        mode: 'insensitive'
      },
      token,
    },
  });

  if (!record) return false;
  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return false;
  }

  await prisma.verificationToken.delete({ where: { token } });
  return true;
}

export async function isEmailVerified(email: string) {
  const pending = await prisma.verificationToken.findFirst({
    where: {
      identifier: {
        equals: EMAIL_VERIFY_PREFIX + email,
        mode: 'insensitive'
      }
    },
  });
  // If there is a pending token, treat as NOT verified
  return !pending;
}
