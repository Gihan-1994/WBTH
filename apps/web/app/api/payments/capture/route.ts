import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";
import { stripe, calculateFees } from "@/lib/stripe";

/**
 * Capture an authorized payment when provider confirms booking
 * POST /api/payments/capture
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paymentId } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
        }

        // Fetch the payment with booking details
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                booking: {
                    include: {
                        user: true,
                        guide: { include: { user: true } },
                        accommodation: { include: { provider: { include: { user: true } } } },
                    },
                },
                sender: true,
                receiver: true,
            },
        });

        if (!payment) {
            return NextResponse.json({ error: "Payment not found" }, { status: 404 });
        }

        // Verify the user is the provider
        if (payment.receiver_id !== session.user.id) {
            return NextResponse.json(
                { error: "Only the provider can confirm payment" },
                { status: 403 }
            );
        }

        // Check payment status
        if (payment.status === "captured") {
            return NextResponse.json({ error: "Payment already captured" }, { status: 400 });
        }

        if (payment.status === "cancelled") {
            return NextResponse.json({ error: "Payment was cancelled" }, { status: 400 });
        }

        // Find the Stripe PaymentIntent
        const paymentIntents = await stripe.paymentIntents.list({
            limit: 100,
        });

        const paymentIntent = paymentIntents.data.find(
            (pi) => pi.metadata.bookingId === payment.booking_id
        );

        if (!paymentIntent) {
            return NextResponse.json(
                { error: "Stripe PaymentIntent not found" },
                { status: 404 }
            );
        }

        // Capture the payment
        const capturedIntent = await stripe.paymentIntents.capture(paymentIntent.id);

        if (capturedIntent.status !== "succeeded") {
            return NextResponse.json(
                { error: "Failed to capture payment" },
                { status: 500 }
            );
        }

        // Calculate fees
        const { platformFee, providerAmount } = calculateFees(payment.amount);

        // Get admin user
        const admin = await prisma.admin.findFirst({
            select: { user_id: true },
        });

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 500 });
        }

        // Update original payment to captured
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "captured", amount: providerAmount },
        });

        // Create platform fee payment record
        await prisma.payment.create({
            data: {
                sender_id: payment.receiver_id, // Provider pays platform fee
                receiver_id: admin.user_id,
                booking_id: payment.booking_id,
                amount: platformFee,
                status: "captured",
            },
        });

        // Update booking status to confirmed
        await prisma.booking.update({
            where: { id: payment.booking_id },
            data: { status: "confirmed" },
        });

        // Create notifications
        await prisma.notification.create({
            data: {
                user_id: payment.sender_id,
                booking_id: payment.booking_id,
                type: "PAYMENT_SENT",
                message: `Your payment of $${payment.amount} has been processed.`,
            },
        });

        await prisma.notification.create({
            data: {
                user_id: payment.receiver_id,
                booking_id: payment.booking_id,
                type: "PAYMENT_RECEIVED",
                message: `You received $${providerAmount} for booking confirmation.`,
            },
        });

        await prisma.notification.create({
            data: {
                user_id: payment.sender_id,
                booking_id: payment.booking_id,
                type: "BOOKING_CONFIRMED",
                message: "Your booking has been confirmed!",
            },
        });

        return NextResponse.json({
            success: true,
            platformFee,
            providerAmount,
            message: "Payment captured successfully",
        });
    } catch (error: any) {
        console.error("Error capturing payment:", error);
        return NextResponse.json(
            { error: error.message || "Failed to capture payment" },
            { status: 500 }
        );
    }
}
