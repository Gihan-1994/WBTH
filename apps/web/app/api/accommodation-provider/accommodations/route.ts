import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * GET handler for fetching all accommodations for the provider.
 * @param req - The incoming request object.
 * @returns JSON response with list of accommodations.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        // Get the provider ID first
        const provider = await prisma.accommodationProvider.findUnique({
            where: { user_id: userId },
        });

        if (!provider) {
            return NextResponse.json({ accommodations: [] });
        }

        const accommodations = await prisma.accommodation.findMany({
            where: { provider_id: provider.provider_id },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ accommodations });
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        return NextResponse.json(
            { error: "Failed to fetch accommodations" },
            { status: 500 }
        );
    }
}

/**
 * POST handler for creating a new accommodation.
 * @param req - The incoming request object.
 * @returns JSON response with created accommodation or error.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const data = await req.json();

    try {
        // Ensure provider exists
        let provider = await prisma.accommodationProvider.findUnique({
            where: { user_id: userId },
        });

        // If provider doesn't exist (e.g. first time), create it
        if (!provider) {
            // We need a company name. If not provided in profile yet, use a placeholder or user's name
            const user = await prisma.user.findUnique({ where: { id: userId } });
            provider = await prisma.accommodationProvider.create({
                data: {
                    user_id: userId,
                    company_name: user?.name || "My Company",
                },
            });
        }

        const accommodation = await prisma.accommodation.create({
            data: {
                provider_id: provider.provider_id,
                name: data.name,
                district: data.district,
                location: data.location,
                type: data.type || [],
                amenities: data.amenities || [],
                budget: data.budget || [],
                interests: data.interests || [],
                travel_style: data.travel_style || [],
                price_range_min: parseFloat(data.price_range_min) || 0,
                price_range_max: parseFloat(data.price_range_max) || 0,
                province: data.province,
                group_size: parseInt(data.group_size) || 0,
                account_no: data.account_no,
                // Initialize other fields
                rating: 0,
                num_booking_dates: 0,
                prior_bookings: 0,
            },
        });

        return NextResponse.json({
            message: "Accommodation created successfully",
            accommodation,
        });
    } catch (error) {
        console.error("Error creating accommodation:", error);
        return NextResponse.json(
            { error: "Failed to create accommodation" },
            { status: 500 }
        );
    }
}
