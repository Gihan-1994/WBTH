import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { guide: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            contact_no: user.contact_no,
            experience: user.guide?.experience || [],
            languages: user.guide?.languages || [],
            expertise: user.guide?.expertise || [],
            price: user.guide?.price || 0,
            booking_price: user.guide?.booking_price || null,
            availability: user.guide?.availability || false,
            city: user.guide?.city || null,
            province: user.guide?.province || null,
            gender: user.guide?.gender || null,
            account_no: user.guide?.account_no || null,
            rating: user.guide?.rating || null,
            profile_picture: user.guide?.profile_picture || null,
            email_notifications_enabled: user.email_notifications_enabled,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const data = await req.json();

    try {
        // Update User model
        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                contact_no: data.contact_no,
            },
        });

        // Parse booking_price safely
        let bookingPrice = null;
        if (data.booking_price !== null && data.booking_price !== undefined && data.booking_price !== '' && data.booking_price !== 0) {
            bookingPrice = parseFloat(data.booking_price);
        }

        // Update or Create Guide model
        await prisma.guide.upsert({
            where: { user_id: userId },
            update: {
                experience: data.experience,
                languages: data.languages,
                expertise: data.expertise,
                price: parseFloat(data.price),
                booking_price: bookingPrice,
                availability: data.availability,
                city: data.city || null,
                province: data.province || null,
                gender: data.gender || null,
                account_no: data.account_no || null,
            },
            create: {
                user_id: userId,
                experience: data.experience,
                languages: data.languages,
                expertise: data.expertise,
                price: parseFloat(data.price),
                booking_price: bookingPrice,
                availability: data.availability,
                city: data.city || null,
                province: data.province || null,
                gender: data.gender || null,
                account_no: data.account_no || null,
            },
        });

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error: any) {
        console.error("Error updating profile:", error);
        console.error("Error details:", error.message);
        console.error("Data received:", data);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
