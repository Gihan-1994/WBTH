import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * GET handler for fetching accommodation images.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the accommodation ID.
 * @returns JSON response with list of images.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const accommodationId = params.id;

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

        return NextResponse.json({ images: accommodation.images });
    } catch (error) {
        console.error("Error fetching accommodation images:", error);
        return NextResponse.json(
            { error: "Failed to fetch images" },
            { status: 500 }
        );
    }
}

/**
 * PUT handler for updating accommodation images.
 * Replaces the entire list of images.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the accommodation ID.
 * @returns JSON response with updated images.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const accommodationId = params.id;
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

        const updatedAccommodation = await prisma.accommodation.update({
            where: { id: accommodationId },
            data: {
                images: data.images,
            },
        });

        return NextResponse.json({
            message: "Images updated successfully",
            images: updatedAccommodation.images,
        });
    } catch (error) {
        console.error("Error updating accommodation images:", error);
        return NextResponse.json(
            { error: "Failed to update images" },
            { status: 500 }
        );
    }
}
