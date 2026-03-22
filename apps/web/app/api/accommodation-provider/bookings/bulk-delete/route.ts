import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * POST handler for bulk deleting bookings.
 * Only the provider who owns the accommodations for these bookings can delete them.
 * @param req - The incoming request object.
 * @returns JSON response confirming deletion or error message.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json({ error: "No booking IDs provided" }, { status: 400 });
    }

    try {
        // Find bookings and verify they all belong to this provider
        const bookings = await prisma.booking.findMany({
            where: {
                id: { in: ids },
                accommodation: {
                    provider: {
                        user_id: userId,
                    },
                },
            },
            select: { id: true }
        });

        const foundIds = bookings.map(b => b.id);
        const unauthorizedIds = ids.filter(id => !foundIds.includes(id));

        if (unauthorizedIds.length > 0) {
            return NextResponse.json({
                error: `Forbidden: You are not authorized to delete some of these bookings (${unauthorizedIds.join(", ")})`
            }, { status: 403 });
        }

        await prisma.booking.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        return NextResponse.json({ message: `${ids.length} bookings deleted successfully` });
    } catch (error) {
        console.error("Error bulk deleting bookings:", error);
        return NextResponse.json(
            { error: "Failed to bulk delete bookings" },
            { status: 500 }
        );
    }
}
