import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id: guideId } = await params;

    try {
        const { availability } = await req.json();

        await prisma.guide.update({
            where: { user_id: guideId },
            data: { availability },
        });

        return NextResponse.json({
            message: `Guide ${availability ? "activated" : "suspended"} successfully`
        });
    } catch (error) {
        console.error("Error updating guide availability:", error);
        return NextResponse.json(
            { error: "Failed to update guide availability" },
            { status: 500 }
        );
    }
}
