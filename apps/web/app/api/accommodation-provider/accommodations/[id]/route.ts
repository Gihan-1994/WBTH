import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * PUT handler for updating an accommodation.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the accommodation ID.
 * @returns JSON response with updated accommodation or error.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id: accommodationId } = await params;
    const data = await req.json();

    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id: accommodationId },
            include: { provider: true },
        });

        if (!accommodation) {
            return NextResponse.json(
                { error: "Accommodation not found" },
                { status: 404 }
            );
        }

        // Authorization check
        if (accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Parse booking_price safely
        let bookingPrice = null;
        if (data.booking_price !== null && data.booking_price !== undefined && data.booking_price !== '' && data.booking_price !== 0) {
            bookingPrice = parseFloat(data.booking_price);
        }

        const updatedAccommodation = await prisma.accommodation.update({
            where: { id: accommodationId },
            data: {
                name: data.name,
                district: data.district,
                location: data.location,
                type: data.type,
                amenities: data.amenities,
                budget: data.budget,
                interests: data.interests,
                travel_style: data.travel_style,
                price_range_min: parseFloat(data.price_range_min),
                price_range_max: parseFloat(data.price_range_max),
                booking_price: bookingPrice,
                province: data.province,
                group_size: parseInt(data.group_size),
                account_no: data.account_no,
            },
        });

        return NextResponse.json({
            message: "Accommodation updated successfully",
            accommodation: updatedAccommodation,
        });
    } catch (error: any) {
        console.error("Error updating accommodation:", error);
        console.error("Error details:", error.message);
        console.error("Data received:", data);
        return NextResponse.json(
            { error: "Failed to update accommodation" },
            { status: 500 }
        );
    }
}

/**
 * DELETE handler for deleting an accommodation.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the accommodation ID.
 * @returns JSON response with success message or error.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id: accommodationId } = await params;

    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id: accommodationId },
            include: { provider: true },
        });

        if (!accommodation) {
            return NextResponse.json(
                { error: "Accommodation not found" },
                { status: 404 }
            );
        }

        // Authorization check
        if (accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if there are active bookings?
        // For now, we'll allow deletion but maybe we should check for future bookings.
        // Prisma might throw error if foreign keys exist (bookings).
        // Let's delete bookings first or handle the error.
        // The schema says `onDelete: SetNull` for bookings->accommodation relation?
        // Let's check schema.
        // `accommodation    Accommodation? @relation(fields: [accommodation_id], references: [id])`
        // It doesn't specify onDelete. Default is usually restrictive.
        // Wait, migration sql said: `ON DELETE SET NULL`.
        // `ALTER TABLE "bookings" ADD CONSTRAINT "bookings_accommodation_id_fkey" FOREIGN KEY ("accommodation_id") REFERENCES "accommodations"("id") ON DELETE SET NULL ON UPDATE CASCADE;`
        // So deletion should be fine, bookings will just lose the reference.

        await prisma.accommodation.delete({
            where: { id: accommodationId },
        });

        return NextResponse.json({ message: "Accommodation deleted successfully" });
    } catch (error) {
        console.error("Error deleting accommodation:", error);
        return NextResponse.json(
            { error: "Failed to delete accommodation" },
            { status: 500 }
        );
    }
}
