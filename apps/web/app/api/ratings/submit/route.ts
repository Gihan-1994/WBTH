import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * Submit or update a rating for a booking
 * POST /api/ratings/submit
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { bookingId, rating, comment } = await req.json();

        if (!bookingId || !rating) {
            return NextResponse.json(
                { error: "Booking ID and rating are required" },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be between 1 and 5" },
                { status: 400 }
            );
        }

        // Verify booking belongs to user and is confirmed
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { rating: true },
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (booking.user_id !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (booking.status !== "confirmed") {
            return NextResponse.json(
                { error: "Can only rate confirmed bookings" },
                { status: 400 }
            );
        }

        // Create or update rating
        const ratingData = {
            booking_id: bookingId,
            user_id: session.user.id,
            rating,
            comment: comment || null,
        };

        let savedRating;
        if (booking.rating) {
            // Update existing rating
            savedRating = await prisma.rating.update({
                where: { id: booking.rating.id },
                data: { rating, comment: comment || null },
            });
        } else {
            // Create new rating
            savedRating = await prisma.rating.create({
                data: ratingData,
            });
        }

        // Update guide's average rating if this is a guide booking
        if (booking.guide_id) {
            // Get all ratings for this guide's bookings
            const guideRatings = await prisma.rating.findMany({
                where: {
                    booking: {
                        guide_id: booking.guide_id,
                    },
                },
                select: {
                    rating: true,
                },
            });

            // Calculate average rating
            if (guideRatings.length > 0) {
                const totalRating = guideRatings.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = totalRating / guideRatings.length;

                // Update guide's rating
                await prisma.guide.update({
                    where: { user_id: booking.guide_id },
                    data: { rating: averageRating },
                });
            }
        }

        // Update accommodation provider's average rating if this is an accommodation booking
        if (booking.accommodation_id) {
            const accommodation = await prisma.accommodation.findUnique({
                where: { id: booking.accommodation_id },
                select: { provider_id: true },
            });

            if (accommodation) {
                // Get all ratings for this provider's accommodations
                const providerRatings = await prisma.rating.findMany({
                    where: {
                        booking: {
                            accommodation: {
                                provider_id: accommodation.provider_id,
                            },
                        },
                    },
                    select: {
                        rating: true,
                    },
                });

                // Calculate average rating
                if (providerRatings.length > 0) {
                    const totalRating = providerRatings.reduce((sum, r) => sum + r.rating, 0);
                    const averageRating = totalRating / providerRatings.length;

                    // Update all accommodations for this provider
                    await prisma.accommodation.updateMany({
                        where: { provider_id: accommodation.provider_id },
                        data: { rating: averageRating },
                    });
                }
            }
        }

        return NextResponse.json({ success: true, rating: savedRating });
    } catch (error: any) {
        console.error("Error submitting rating:", error);
        return NextResponse.json(
            { error: error.message || "Failed to submit rating" },
            { status: 500 }
        );
    }
}
