import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

// GET - Fetch all blocked dates for an accommodation
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: accommodationId } = await params;

    try {
        const blockedDates = await prisma.blockedDate.findMany({
            where: { accommodation_id: accommodationId },
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

// POST - Add blocked dates
export async function POST(
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
        // Verify ownership
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

        if (accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { dates, reason } = data;

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return NextResponse.json(
                { error: "No dates provided" },
                { status: 400 }
            );
        }

        // Create blocked dates (skip existing ones)
        const blockedDates = await Promise.all(
            dates.map(async (dateStr: string) => {
                const date = new Date(dateStr);
                return prisma.blockedDate.upsert({
                    where: {
                        accommodation_id_date: {
                            accommodation_id: accommodationId,
                            date,
                        },
                    },
                    update: { reason },
                    create: {
                        accommodation_id: accommodationId,
                        date,
                        reason,
                    },
                });
            })
        );

        return NextResponse.json({
            message: "Dates blocked successfully",
            blockedDates,
        });
    } catch (error) {
        console.error("Error blocking dates:", error);
        return NextResponse.json(
            { error: "Failed to block dates" },
            { status: 500 }
        );
    }
}

// DELETE - Remove blocked dates
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
    const data = await req.json();

    try {
        // Verify ownership
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

        if (accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { dates } = data;

        if (!dates || !Array.isArray(dates) || dates.length === 0) {
            return NextResponse.json(
                { error: "No dates provided" },
                { status: 400 }
            );
        }

        // Delete blocked dates
        await prisma.blockedDate.deleteMany({
            where: {
                accommodation_id: accommodationId,
                date: {
                    in: dates.map((d: string) => new Date(d)),
                },
            },
        });

        return NextResponse.json({ message: "Dates unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking dates:", error);
        return NextResponse.json(
            { error: "Failed to unblock dates" },
            { status: 500 }
        );
    }
}
