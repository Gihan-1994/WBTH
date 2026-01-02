import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Update an event
 * PUT /api/admin/events/[id]
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const eventId = params.id;

        const body = await req.json();
        const { category, date, location, description } = body;

        const updateData: any = {};
        if (category) updateData.category = category;
        if (date) updateData.date = new Date(date);
        if (location) updateData.location = location;
        if (description !== undefined) updateData.description = description;

        const event = await prisma.event.update({
            where: { id: eventId },
            data: updateData
        });

        return NextResponse.json({
            success: true,
            event
        });

    } catch (error: any) {
        console.error("Error updating event:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update event" },
            { status: 500 }
        );
    }
}

/**
 * Delete an event
 * DELETE /api/admin/events/[id]
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin();
        const eventId = params.id;

        await prisma.event.delete({
            where: { id: eventId }
        });

        return NextResponse.json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error: any) {
        console.error("Error deleting event:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete event" },
            { status: 500 }
        );
    }
}
