import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get all bookings with status filtering
 * GET /api/admin/bookings?status=pending|confirmed|cancelled
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                guide: {
                    select: {
                        user: {
                            select: {
                                name: true,
                            }
                        }
                    }
                },
                accommodation: {
                    select: {
                        name: true,
                        provider: {
                            select: {
                                company_name: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                start_date: "desc"
            }
        });

        return NextResponse.json({ bookings });

    } catch (error: any) {
        console.error("Error fetching bookings:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
