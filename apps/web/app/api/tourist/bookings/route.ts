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
        const bookings = await prisma.booking.findMany({
            where: { user_id: userId },
            orderBy: { start_date: "desc" },
            include: {
                accommodation: {
                    select: { name: true },
                },
                guide: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                },
                payments: {
                    where: {
                        sender_id: userId,
                    },
                    orderBy: {
                        id: "desc",
                    },
                    take: 1,
                },
                rating: true, // Include rating data
            },
        });

        const stats = {
            total: bookings.length,
            pending: bookings.filter((b) => b.status === "pending").length,
            confirmed: bookings.filter((b) => b.status === "confirmed").length,
            cancelled: bookings.filter((b) => b.status === "cancelled").length,
        };

        return NextResponse.json({ bookings, stats });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
