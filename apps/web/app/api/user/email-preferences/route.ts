import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * Update user's email notification preference
 */
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const { email_notifications_enabled } = await req.json();

        if (typeof email_notifications_enabled !== 'boolean') {
            return NextResponse.json(
                { error: "Invalid value for email_notifications_enabled" },
                { status: 400 }
            );
        }

        await prisma.user.update({
            where: { id: userId },
            data: { email_notifications_enabled },
        });

        return NextResponse.json({
            message: "Email notification preference updated successfully",
            email_notifications_enabled,
        });
    } catch (error) {
        console.error("Error updating email notification preference:", error);
        return NextResponse.json(
            { error: "Failed to update preference" },
            { status: 500 }
        );
    }
}
