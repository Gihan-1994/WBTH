import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * GET handler for fetching accommodation provider bookings.
 * Fetches bookings for all accommodations owned by the provider.
 * @param req - The incoming request object.
 * @returns JSON response with bookings list and statistics.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // Find bookings where the accommodation belongs to a provider with this user_id
        const bookings = await prisma.booking.findMany({
            where: {
                accommodation: {
                    provider: {
                        user_id: userId,
                    },
                },
            },
            orderBy: { start_date: "desc" },
            include: {
                user: {
                    select: { name: true, email: true, contact_no: true },
                },
                accommodation: {
                    select: { name: true },
                },
            },
        });

        const stats = {
            total: bookings.length,
            pending: bookings.filter((b) => b.status === "pending").length,
            confirmed: bookings.filter((b) => b.status === "confirmed").length,
            cancelled: bookings.filter((b) => b.status === "cancelled").length,
            income: bookings
                .filter((b) => b.status === "confirmed")
                .reduce((sum, b) => sum + b.price, 0),
        };

        return NextResponse.json({ bookings, stats });
    } catch (error) {
        console.error("Error fetching provider bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
