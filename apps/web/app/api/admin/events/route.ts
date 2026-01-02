import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get all events
 * GET /api/admin/events
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const events = await prisma.event.findMany({
            orderBy: {
                date: "desc"
            }
        });

        return NextResponse.json({ events });

    } catch (error: any) {
        console.error("Error fetching events:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

/**
 * Create a new event
 * POST /api/admin/events
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const body = await req.json();
        const { category, date, location, description } = body;

        if (!category || !date || !location) {
            return NextResponse.json(
                { error: "Category, date, and location are required" },
                { status: 400 }
            );
        }

        const event = await prisma.event.create({
            data: {
                category,
                date: new Date(date),
                location,
                description: description || [],
            }
        });

        return NextResponse.json({
            success: true,
            event
        });

    } catch (error: any) {
        console.error("Error creating event:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create event" },
            { status: 500 }
        );
    }
}
