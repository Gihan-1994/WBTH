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
    const userId = session.user.id;
    const { id: bookingId } = await params;

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (booking.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (booking.status !== "pending") {
            return NextResponse.json(
                { error: "Only pending bookings can be cancelled" },
                { status: 400 }
            );
        }

        await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "cancelled" },
        });

        // Create notifications for both parties
        const { notifyBookingCancelled } = await import("@/lib/notifications");

        const tourist = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true },
        });

        let providerId: string;
        let providerName: string;

        if (booking.type === "accommodation" && booking.accommodation_id) {
            const accommodation = await prisma.accommodation.findUnique({
                where: { id: booking.accommodation_id },
                include: {
                    provider: {
                        include: { user: { select: { id: true, name: true } } },
                    },
                },
            });
            providerId = accommodation?.provider.user.id || "";
            providerName = accommodation?.provider.user.name || "";
        } else if (booking.type === "guide" && booking.guide_id) {
            const guide = await prisma.guide.findUnique({
                where: { user_id: booking.guide_id },
                include: { user: { select: { id: true, name: true } } },
            });
            providerId = guide?.user.id || "";
            providerName = guide?.user.name || "";
        } else {
            providerId = "";
            providerName = "";
        }

        if (tourist && providerId) {
            await notifyBookingCancelled({
                bookingId: booking.id,
                touristId: tourist.id,
                touristName: tourist.name,
                providerId,
                providerName,
                bookingType: booking.type,
                startDate: booking.start_date,
                endDate: booking.end_date,
                cancelledBy: "tourist",
            });
        }

        return NextResponse.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return NextResponse.json(
            { error: "Failed to cancel booking" },
            { status: 500 }
        );
    }
}
