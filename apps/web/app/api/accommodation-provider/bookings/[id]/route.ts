import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * DELETE handler for deleting a specific booking.
 * Only the provider who owns the accommodation for this booking can delete it.
 * @param req - The incoming request object.
 * @param context - The context object containing the booking ID.
 * @returns JSON response confirming deletion or error message.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    const { id: bookingId } = await params;

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        // Find the booking and check if the current user is the provider for its accommodation
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                accommodation: {
                    select: {
                        provider: {
                            select: { user_id: true }
                        }
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (!booking.accommodation || booking.accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Forbidden: You are not the provider for this booking" }, { status: 403 });
        }

        // Delete associated ratings first (if any) or any other dependent data
        // For simplicity, we assume Prisma handles cascading or there are no other dependents.
        // If there are payments, we might want to handle them too.

        await prisma.booking.delete({
            where: { id: bookingId }
        });

        return NextResponse.json({ message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return NextResponse.json(
            { error: "Failed to delete booking" },
            { status: 500 }
        );
    }
}
