import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    try {
        // Delete all bookings for this accommodation first
        await prisma.booking.deleteMany({
            where: { accommodation_id: id },
        });

        // Delete the accommodation
        await prisma.accommodation.delete({
            where: { id },
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
