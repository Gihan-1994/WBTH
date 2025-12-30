import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const { searchParams } = new URL(req.url);
        const unreadOnly = searchParams.get("unread_only") === "true";
        const limit = parseInt(searchParams.get("limit") || "20");
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build where clause
        const where: any = { user_id: userId };
        if (unreadOnly) {
            where.is_read = false;
        }

        // Fetch notifications
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { created_at: "desc" },
            take: limit,
            skip: offset,
            include: {
                booking: {
                    select: {
                        id: true,
                        type: true,
                        status: true,
                        start_date: true,
                        end_date: true,
                    },
                },
            },
        });

        // Get unread count
        const unreadCount = await prisma.notification.count({
            where: { user_id: userId, is_read: false },
        });

        return NextResponse.json({
            notifications,
            unreadCount,
            total: notifications.length,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}
