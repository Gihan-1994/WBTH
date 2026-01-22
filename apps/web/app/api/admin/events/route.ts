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

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

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
                    { error: "Error creating event: Total image size exceeds 10MB limit. Please use smaller images or fewer images." },
                    { status: 400 }
                );
            }

            // Validate each image is a valid base64 string or URL
            for (let i = 0; i < eventImages.length; i++) {
                const img = eventImages[i];
                if (!img || typeof img !== 'string') {
                    return NextResponse.json(
                        { error: `Error creating event: Invalid image format at position ${i + 1}` },
                        { status: 400 }
                    );
                }

                // Check if it's a valid base64 data URL or regular URL
                const isValidDataUrl = img.startsWith('data:image/');
                const isValidUrl = img.startsWith('http://') || img.startsWith('https://');

                if (!isValidDataUrl && !isValidUrl) {
                    return NextResponse.json(
                        { error: `Error creating event: Image at position ${i + 1} must be a valid data URL or HTTP URL` },
                        { status: 400 }
                    );
                }
            }
        }

        const event = await prisma.event.create({
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
        console.error("Error creating event:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        // Check for database size errors
        if (error.message && (
            error.message.includes('too large') ||
            error.message.includes('exceeds') ||
            error.message.includes('maximum')
        )) {
            return NextResponse.json(
                { error: "Error creating event: Image data is too large for database. Please use smaller images." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Error creating event: Failed to create event. Please try with smaller images or contact support." },
            { status: 500 }
        );
    }
}
