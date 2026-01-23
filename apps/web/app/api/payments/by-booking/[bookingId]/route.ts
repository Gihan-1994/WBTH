import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

/**
 * Get payment by booking ID
 * GET /api/payments/by-booking/[bookingId]
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await params;

        console.log("Looking for payment with booking_id:", bookingId);

        const payment = await prisma.payment.findFirst({
            where: { booking_id: bookingId },
            orderBy: { id: "desc" },
        });

        console.log("Found payment:", payment ? `ID: ${payment.id}, Status: ${payment.status}` : "NOT FOUND");

        if (!payment) {
            // Also check all payments to help debug
            const allPayments = await prisma.payment.findMany({
                select: { id: true, booking_id: true, status: true },
                take: 5,
                orderBy: { id: "desc" },
            });
            console.log("Recent payments:", allPayments);

            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        return NextResponse.json({ payment });
    } catch (error: any) {
        console.error("Error fetching payment:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch payment" },
            { status: 500 }
        );
    }
}
