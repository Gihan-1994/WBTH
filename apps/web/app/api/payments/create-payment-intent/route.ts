import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";
import { stripe } from "@/lib/stripe";

/**
 * Create a Stripe PaymentIntent for a booking
 * POST /api/payments/create-payment-intent
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookingId } = await req.json();

        if (!bookingId) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        // Fetch the booking
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: true,
                guide: { include: { user: true } },
                accommodation: { include: { provider: { include: { user: true } } } },
            },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Verify the user owns this booking
        if (booking.user_id !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if payment already exists
        const existingPayment = await prisma.payment.findFirst({
            where: {
                booking_id: bookingId,
                status: { in: ["authorized", "captured"] },
            },
        });

        if (existingPayment) {
            return NextResponse.json(
                { error: "Payment already exists for this booking" },
                { status: 400 }
            );
        }

        // Determine the provider (guide or accommodation provider)
        let providerId: string;
        if (booking.type === "guide" && booking.guide) {
            providerId = booking.guide.user_id;
        } else if (booking.type === "accommodation" && booking.accommodation) {
            providerId = booking.accommodation.provider.user_id;
        } else {
            return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });
        }

        // Create Stripe PaymentIntent with manual capture
        const amountInCents = Math.round(booking.price * 100); // Convert to cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "usd",
            capture_method: "manual", // Authorization only, capture later
            metadata: {
                bookingId: booking.id,
                userId: session.user.id,
                providerId,
                bookingType: booking.type,
            },
        });

        // Create Payment record in database
        const payment = await prisma.payment.create({
            data: {
                sender_id: session.user.id,
                receiver_id: providerId,
                booking_id: bookingId,
                amount: booking.price,
                status: "pending", // Will update to "authorized" after successful payment
                stripe_payment_intent_id: paymentIntent.id,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentId: payment.id,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: any) {
        console.error("Error creating payment intent:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create payment intent" },
            { status: 500 }
        );
    }
}
