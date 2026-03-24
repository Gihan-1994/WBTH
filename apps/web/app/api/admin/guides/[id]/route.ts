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

    const { id: guideId } = await params;

    try {
        // Delete all bookings for this guide
        await prisma.booking.deleteMany({
            where: { guide_id: guideId },
        });

        // Delete the guide
        await prisma.guide.delete({
            where: { user_id: guideId },
        });

        // Delete the user account
        await prisma.user.delete({
            where: { id: guideId },
        });

        return NextResponse.json({ message: "Guide deleted successfully" });
    } catch (error) {
        console.error("Error deleting guide:", error);
        return NextResponse.json(
            { error: "Failed to delete guide" },
            { status: 500 }
        );
    }
}
