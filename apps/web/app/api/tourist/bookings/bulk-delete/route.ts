import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { error: "Booking IDs must be provided as a non-empty array" },
                { status: 400 }
            );
        }

        // Verify that all bookings belong to the user and are deletable
        const bookings = await prisma.booking.findMany({
            where: {
                id: { in: ids },
                user_id: userId,
            },
        });

        if (bookings.length !== ids.length) {
            return NextResponse.json(
                { error: "One or more bookings not found or do not belong to you" },
                { status: 403 }
            );
        }

        const nonDeletable = bookings.filter(
            (b) => b.status !== 'cancelled'
        );

        if (nonDeletable.length > 0) {
            return NextResponse.json(
                { error: "Only cancelled bookings can be deleted from history" },
                { status: 400 }
            );
        }

        await prisma.booking.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ message: "Bookings deleted successfully" });
    } catch (error) {
        console.error("Error bulk deleting bookings:", error);
        return NextResponse.json(
            { error: "Failed to delete bookings" },
            { status: 500 }
        );
    }
}
