import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Get all blocked dates for this accommodation (marked as fully booked by provider)
        const blockedDates = await prisma.blockedDate.findMany({
            where: {
                accommodation_id: id,
            },
            select: {
                date: true,
                reason: true,
            },
            orderBy: { date: "asc" },
        });

        return NextResponse.json({ blockedDates });
    } catch (error) {
        console.error("Error fetching blocked dates:", error);
        return NextResponse.json(
            { error: "Failed to fetch blocked dates" },
            { status: 500 }
        );
    }
}
