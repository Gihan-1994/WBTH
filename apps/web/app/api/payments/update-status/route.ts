import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * Update payment status
 * POST /api/payments/update-status
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paymentId, status } = await req.json();

        if (!paymentId || !status) {
            return NextResponse.json(
                { error: "Payment ID and status are required" },
                { status: 400 }
            );
        }

        // Update payment status
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: { status },
        });

        return NextResponse.json({ success: true, payment });
    } catch (error: any) {
        console.error("Error updating payment status:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update payment status" },
            { status: 500 }
        );
    }
}
