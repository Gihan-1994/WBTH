import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * GET handler for fetching accommodation provider profile.
 * @param req - The incoming request object.
 * @returns JSON response with profile data or error message.
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { accommodationProvider: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            contact_no: user.contact_no,
            company_name: user.accommodationProvider?.company_name || "",
            provider_id: user.accommodationProvider?.provider_id || null,
            logo: user.accommodationProvider?.logo || null,
        });
    } catch (error) {
        console.error("Error fetching provider profile:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

/**
 * PUT handler for updating accommodation provider profile.
 * @param req - The incoming request object.
 * @returns JSON response with success message or error.
 */
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

        // Update or Create AccommodationProvider model
        await prisma.accommodationProvider.upsert({
            where: { user_id: userId },
            update: {
                company_name: data.company_name,
                logo: data.logo,
            },
            create: {
                user_id: userId,
                company_name: data.company_name,
                logo: data.logo,
            },
        });

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating provider profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
