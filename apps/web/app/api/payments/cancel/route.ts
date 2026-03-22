import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";
import { stripe } from "@/lib/stripe";

/**
 * Cancel an authorized payment when provider declines booking
 * POST /api/payments/cancel
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { paymentId } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ warning: "Payment ID is required" }, { status: 400 });
        }

        // Fetch the payment with booking details
        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                booking: true,
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
                { error: "Only the provider can cancel payment" },
                { status: 403 }
            );
        }

        // Check payment status
        if (payment.status === "captured") {
            return NextResponse.json(
                { error: "Cannot cancel captured payment" },
                { status: 400 }
            );
        }

        if (payment.status === "cancelled") {
            return NextResponse.json({ success: true, message: "Payment already cancelled" }, { status: 200 });
        }

        // Find the Stripe PaymentIntent
        let paymentIntentId = payment.stripe_payment_intent_id;

        if (!paymentIntentId) {
            // Fallback to searching by metadata if stripe_payment_intent_id is missing
            const paymentIntents = await stripe.paymentIntents.list({
                limit: 100,
            });

            const foundIntent = paymentIntents.data.find(
                (pi) => pi.metadata.bookingId === payment.booking_id
            );
            paymentIntentId = foundIntent?.id || null;
        }

        if (paymentIntentId) {
            try {
                // Retrieve the PaymentIntent to check its status
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

                // Only cancel if it's in a cancellable state
                if (paymentIntent.status === "requires_payment_method" ||
                    paymentIntent.status === "requires_confirmation" ||
                    paymentIntent.status === "requires_action" ||
                    paymentIntent.status === "requires_capture") {
                    // Cancel the PaymentIntent (releases authorization)
                    await stripe.paymentIntents.cancel(paymentIntentId);
                } else {
                    console.log(`PaymentIntent ${paymentIntentId} is in status ${paymentIntent.status}, skipping Stripe cancel.`);
                }
            } catch (stripeErr: any) {
                console.error("Error cancelling Stripe PaymentIntent:", stripeErr);
                // Continue with DB update even if Stripe cancel fails (e.g. if it was already cancelled)
            }
        }

        // Update payment status to cancelled
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: "cancelled" },
        });

        // Update booking status to cancelled
        await prisma.booking.update({
            where: { id: payment.booking_id },
            data: { status: "cancelled" },
        });

        // Create notifications
        await prisma.notification.create({
            data: {
                user_id: payment.sender_id,
                booking_id: payment.booking_id,
                type: "BOOKING_CANCELLED",
                message: "Your booking has been cancelled and payment authorization released.",
            },
        });

        await prisma.notification.create({
            data: {
                user_id: payment.receiver_id,
                booking_id: payment.booking_id,
                type: "BOOKING_CANCELLED",
                message: "You cancelled the booking.",
            },
        });

        return NextResponse.json({
            success: true,
            message: "Payment cancelled successfully",
        });
    } catch (error: any) {
        console.error("Error cancelling payment:", error);
        return NextResponse.json(
            { error: error.message || "Failed to cancel payment" },
            { status: 500 }
        );
    }
}
