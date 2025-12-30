import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const bookingId = params.id;

    try {
        // Find the booking and verify it belongs to this guide
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                guide: true,
            },
        });

        if (!booking || booking.type !== "guide") {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        if (booking.guide_id !== userId) {
            return NextResponse.json(
                { error: "You don't have permission to confirm this booking" },
                { status: 403 }
            );
        }

        if (booking.status !== "pending") {
            return NextResponse.json(
                { error: "Only pending bookings can be confirmed" },
                { status: 400 }
            );
        }

        // Update booking status to confirmed
        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "confirmed" },
        });

        // Create notifications for both parties
        const { notifyBookingConfirmed } = await import("@/lib/notifications");

        const tourist = await prisma.user.findUnique({
            where: { id: booking.user_id },
            select: { id: true, name: true },
        });

        const guide = await prisma.guide.findUnique({
            where: { user_id: userId },
            include: { user: { select: { name: true } } },
        });

        if (tourist && guide) {
            await notifyBookingConfirmed({
                bookingId: booking.id,
                touristId: tourist.id,
                touristName: tourist.name,
                providerId: userId,
                providerName: guide.user.name,
                bookingType: booking.type,
                startDate: booking.start_date,
                endDate: booking.end_date,
            });
        }

        return NextResponse.json({ message: "Booking confirmed successfully" });
    } catch (error) {
        console.error("Error confirming booking:", error);
        return NextResponse.json(
            { error: "Failed to confirm booking" },
            { status: 500 }
        );
    }
}
