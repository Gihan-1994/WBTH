import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

/**
 * Get upcoming events (public endpoint)
 * GET /api/events/upcoming
 */
export async function GET(req: NextRequest) {
    try {
        const now = new Date();

        const events = await prisma.event.findMany({
            where: {
                date: {
                    gte: now
                }
            },
            orderBy: {
                date: "asc"
            }
        });

        return NextResponse.json({ events });

    } catch (error: any) {
        console.error("Error fetching upcoming events:", error);

        return NextResponse.json(
            { error: "Failed to fetch upcoming events" },
            { status: 500 }
        );
    }
}
