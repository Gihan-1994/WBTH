import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Get all non-cancelled bookings for this accommodation
        const bookings = await prisma.booking.findMany({
            where: {
                accommodation_id: id,
                status: { not: "cancelled" },
            },
            select: {
                start_date: true,
                end_date: true,
                status: true,
            },
            orderBy: { start_date: "asc" },
        });

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Error fetching accommodation bookings:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
