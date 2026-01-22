import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get a single event by ID
 * GET /api/admin/events/[id]
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAdmin();
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        const { id } = await params;

        const event = await prisma.event.findUnique({
            where: { id }
        });

        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ event });

    } catch (error: any) {
        console.error("Error fetching event:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

/**
 * Update an event
 * PUT /api/admin/events/[id]
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id: eventId } = await params;

        const body = await req.json();
        const { title, category, date, location, description, eventImages } = body;

        if (!title || !category || !date || !location) {
            return NextResponse.json(
                { error: "Title, category, date, and location are required" },
                { status: 400 }
            );
        }

        // Validate eventImages if provided
        if (eventImages && Array.isArray(eventImages)) {
            // Check if total size of images is reasonable
            const totalSize = eventImages.reduce((acc, img) => acc + (img?.length || 0), 0);
            const maxSize = 10 * 1024 * 1024; // 10MB total limit for all images

            if (totalSize > maxSize) {
                return NextResponse.json(
                    { error: "Error updating Image: Total image size exceeds 10MB limit. Please use smaller images or fewer images." },
                    { status: 400 }
                );
            }

            // Validate each image is a valid base64 string or URL
            for (let i = 0; i < eventImages.length; i++) {
                const img = eventImages[i];
                if (!img || typeof img !== 'string') {
                    return NextResponse.json(
                        { error: `Error updating Image: Invalid image format at position ${i + 1}` },
                        { status: 400 }
                    );
                }

                // Check if it's a valid base64 data URL or regular URL
                const isValidDataUrl = img.startsWith('data:image/');
                const isValidUrl = img.startsWith('http://') || img.startsWith('https://');

                if (!isValidDataUrl && !isValidUrl) {
                    return NextResponse.json(
                        { error: `Error updating Image: Image at position ${i + 1} must be a valid data URL or HTTP URL` },
                        { status: 400 }
                    );
                }
            }
        }

        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                category,
                date: new Date(date),
                location,
                description: description || [],
                eventImages: eventImages || [],
            }
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

        // Check for Prisma-specific errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Error updating Image: Duplicate entry" },
                { status: 400 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Check for database size errors
        if (error.message && (
            error.message.includes('too large') ||
            error.message.includes('exceeds') ||
            error.message.includes('maximum')
        )) {
            return NextResponse.json(
                { error: "Error updating Image: Image data is too large for database. Please use smaller images." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error updating Image: Failed to update event. Please try with smaller images or contact support." },
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin();
        const { id: eventId } = await params;

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
