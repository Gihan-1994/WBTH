import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@repo/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const amenities = searchParams.get("amenities");
    const type = searchParams.get("type");
    const guests = searchParams.get("guests");

    const where: Prisma.AccommodationWhereInput = {};

    if (district) {
        where.district = {
            contains: district,
            mode: "insensitive",
        };
    }

    if (minPrice) {
        where.price_range_min = {
            gte: parseFloat(minPrice),
        };
    }

    if (maxPrice) {
        where.price_range_max = {
            lte: parseFloat(maxPrice),
        };
    }

    if (amenities) {
        const amenitiesList = amenities.split(",").map((a) => a.trim());
        where.amenities = {
            hasSome: amenitiesList,
        };
    }

    if (type) {
        const typeList = type.split(",").map((t) => t.trim());
        where.type = {
            hasSome: typeList,
        };
    }

    if (guests) {
        where.group_size = {
            gte: parseInt(guests),
        };
    }

    try {
        const accommodations = await prisma.accommodation.findMany({
            where,
            include: {
                provider: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                contact_no: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(accommodations);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        return NextResponse.json(
            { error: "Failed to fetch accommodations" },
            { status: 500 }
        );
    }
}
