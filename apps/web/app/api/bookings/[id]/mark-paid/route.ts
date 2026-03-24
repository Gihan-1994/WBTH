import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function POST(
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
        // Get the booking with accommodation info
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
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Authorization check - only the provider can mark as paid
        if (booking.accommodation?.provider.user_id !== userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        // Can only mark pay_at_property bookings as paid
        if (booking.payment_method !== "pay_at_property") {
            return NextResponse.json(
                { error: "Only pay at property bookings can be marked as paid" },
                { status: 400 }
            );
        }

        // Update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: { is_paid: true },
        });

        return NextResponse.json({
            message: "Booking marked as paid",
            booking: updatedBooking,
        });
    } catch (error) {
        console.error("Error marking booking as paid:", error);
        return NextResponse.json(
            { error: "Failed to mark booking as paid" },
            { status: 500 }
        );
    }
}
