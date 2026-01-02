import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get all accommodations categorized by providers
 * GET /api/admin/accommodations
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const providers = await prisma.accommodationProvider.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        contact_no: true,
                    }
                },
                accommodations: {
                    include: {
                        _count: {
                            select: {
                                bookings: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                company_name: "asc"
            }
        });

        return NextResponse.json({ providers });

    } catch (error: any) {
        console.error("Error fetching accommodations:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch accommodations" },
            { status: 500 }
        );
    }
}
