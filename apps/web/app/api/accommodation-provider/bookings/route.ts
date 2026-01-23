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

        // Calculate income from captured payments (provider receives 90% after platform fee)
        const capturedPayments = await prisma.payment.findMany({
            where: {
                receiver_id: userId,
                status: "captured",
            },
        });

        const totalIncome = capturedPayments.reduce((sum, payment) => sum + payment.amount, 0);

        // Calculate average rating (excluding 0 ratings)
        const ratings = await prisma.rating.findMany({
            where: {
                booking: {
                    accommodation: {
                        provider: {
                            user_id: userId,
                        },
                    },
                },
                rating: { gt: 0 },
            },
        });

        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        const stats = {
            total: bookings.length,
            pending: bookings.filter((b) => b.status === "pending").length,
            confirmed: bookings.filter((b) => b.status === "confirmed").length,
            cancelled: bookings.filter((b) => b.status === "cancelled").length,
            income: totalIncome, // Actual income from captured payments (90% of booking price)
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
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
