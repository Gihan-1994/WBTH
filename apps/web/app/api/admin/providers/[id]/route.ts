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

    const { id: providerId } = await params;

    try {
        // Get the provider to find the user_id
        const provider = await prisma.accommodationProvider.findUnique({
            where: { provider_id: providerId },
            include: { accommodations: true },
        });

        if (!provider) {
            return NextResponse.json({ error: "Provider not found" }, { status: 404 });
        }

        // Delete all bookings for all accommodations
        for (const acc of provider.accommodations) {
            await prisma.booking.deleteMany({
                where: { accommodation_id: acc.id },
            });
        }

        // Delete all accommodations
        await prisma.accommodation.deleteMany({
            where: { provider_id: providerId },
        });

        // Delete the provider
        await prisma.accommodationProvider.delete({
            where: { provider_id: providerId },
        });

        // Optionally delete the user account as well
        await prisma.user.delete({
            where: { id: provider.user_id },
        });

        return NextResponse.json({ message: "Provider deleted successfully" });
    } catch (error) {
        console.error("Error deleting provider:", error);
        return NextResponse.json(
            { error: "Failed to delete provider" },
            { status: 500 }
        );
    }
}
