import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * PUT handler for cancelling a booking by accommodation provider.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the booking ID.
 * @returns JSON response with success message or error.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id: bookingId } = await params;

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    include: {
                        provider: true,
                    },
                },
            },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Ensure the booking belongs to an accommodation owned by this provider
        if (booking.accommodation?.provider?.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (booking.status === "cancelled") {
            return NextResponse.json(
                { error: "Booking is already cancelled" },
                { status: 400 }
            );
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "cancelled" },
        });

        return NextResponse.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}
