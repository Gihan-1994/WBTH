import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";

/**
 * Get comprehensive analytics data for admin dashboard
 * GET /api/admin/analytics?period=daily|weekly
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const period = searchParams.get("period") || "daily";

        // Calculate date range based on period
        const now = new Date();
        const daysToSubtract = period === "weekly" ? 7 : 1;
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        // Get user statistics
        const totalUsers = await prisma.user.count();
        const usersByType = await prisma.user.groupBy({
            by: ["role"],
            _count: true,
        });

        // Get user growth over time
        const userGrowth = await prisma.user.findMany({
            where: {
                created_at: {
                    gte: startDate
                }
            },
            select: {
                created_at: true,
            },
            orderBy: {
                created_at: "asc"
            }
        });

        // Group by date
        const growthByDate: Record<string, number> = {};
        userGrowth.forEach(user => {
            const date = user.created_at.toISOString().split('T')[0];
            growthByDate[date] = (growthByDate[date] || 0) + 1;
        });

        // Get booking statistics
        const totalBookings = await prisma.booking.count();
        const bookingsByStatus = await prisma.booking.groupBy({
            by: ["status"],
            _count: true,
        });

        // Get bookings over time
        const bookingsOverTime = await prisma.booking.findMany({
            where: {
                start_date: {
                    gte: startDate
                }
            },
            select: {
                start_date: true,
            },
            orderBy: {
                start_date: "asc"
            }
        });

        // Group by date
        const bookingsByDate: Record<string, number> = {};
        bookingsOverTime.forEach(booking => {
            const date = booking.start_date.toISOString().split('T')[0];
            bookingsByDate[date] = (bookingsByDate[date] || 0) + 1;
        });

        // Calculate booking conversion rate
        const confirmedBookings = await prisma.booking.count({
            where: { status: "confirmed" }
        });
        const conversionRate = totalBookings > 0
            ? (confirmedBookings / totalBookings) * 100
            : 0;

        // Get revenue statistics (sum of confirmed booking prices)
        const revenueData = await prisma.booking.findMany({
            where: {
                status: "confirmed",
                start_date: {
                    gte: startDate
                }
            },
            select: {
                price: true,
                start_date: true,
            },
            orderBy: {
                start_date: "asc"
            }
        });

        const totalRevenue = revenueData.reduce((sum, booking) => sum + booking.price, 0);

        // Group revenue by date
        const revenueByDate: Record<string, number> = {};
        revenueData.forEach(booking => {
            const date = booking.start_date.toISOString().split('T')[0];
            revenueByDate[date] = (revenueByDate[date] || 0) + booking.price;
        });

        // Get popular destinations
        const accommodationBookings = await prisma.booking.groupBy({
            by: ["location"],
            where: {
                location: {
                    not: null
                }
            },
            _count: true,
            orderBy: {
                _count: {
                    location: "desc"
                }
            },
            take: 10
        });

        // Get active guides and providers
        const activeGuides = await prisma.guide.count({
            where: { availability: true }
        });

        const activeProviders = await prisma.accommodationProvider.count();

        return NextResponse.json({
            userStats: {
                total: totalUsers,
                byType: Object.fromEntries(
                    usersByType.map(item => [item.role, item._count])
                ),
                growth: Object.entries(growthByDate).map(([date, count]) => ({
                    date,
                    count
                }))
            },
            bookingStats: {
                total: totalBookings,
                byStatus: Object.fromEntries(
                    bookingsByStatus.map(item => [item.status, item._count])
                ),
                overTime: Object.entries(bookingsByDate).map(([date, count]) => ({
                    date,
                    count
                })),
                conversionRate: Math.round(conversionRate * 100) / 100
            },
            revenueStats: {
                total: totalRevenue,
                trends: Object.entries(revenueByDate).map(([date, amount]) => ({
                    date,
                    amount
                }))
            },
            popularDestinations: accommodationBookings.map(item => ({
                location: item.location || "Unknown",
                count: item._count
            })),
            activeGuides,
            activeProviders
        });

    } catch (error: any) {
        console.error("Error fetching analytics:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 }
        );
    }
}
