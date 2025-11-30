import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const data = await req.json();

    const { type, itemId, startDate, endDate, price, location } = data;

    if (!type || !itemId || !startDate || !endDate || !price) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
        return NextResponse.json(
            { error: "End date must be after start date" },
            { status: 400 }
        );
    }

    try {
        let bookingData: any = {
            user_id: userId,
            type,
            start_date: start,
            end_date: end,
            price: parseFloat(price),
            status: "pending",
            location,
        };

        if (type === "accommodation") {
            bookingData.accommodation_id = itemId;
        } else if (type === "guide") {
            bookingData.guide_id = itemId;
        } else {
            return NextResponse.json(
                { error: "Invalid booking type" },
                { status: 400 }
            );
        }

        const booking = await prisma.booking.create({
            data: bookingData,
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json(
            { error: "Failed to create booking" },
            { status: 500 }
        );
    }
}
