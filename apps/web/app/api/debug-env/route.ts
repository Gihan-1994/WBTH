import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        nodeEnv: process.env.NODE_ENV,
        hasPrisma: "prisma" in global || "prisma" in globalThis,
    });
}
