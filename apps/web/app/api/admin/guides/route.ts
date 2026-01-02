import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get all guides with full details
 * GET /api/admin/guides
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const guides = await prisma.guide.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contact_no: true,
                    }
                },
                _count: {
                    select: {
                        bookings: true
                    }
                }
            },
            orderBy: {
                user: {
                    name: "asc"
                }
            }
        });

        return NextResponse.json({ guides });

    } catch (error: any) {
        console.error("Error fetching guides:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch guides" },
            { status: 500 }
        );
    }
}
