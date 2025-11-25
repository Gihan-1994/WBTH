import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma/src/client";

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
            availability: user.guide?.availability || false,
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

        // Update or Create Guide model
        await prisma.guide.upsert({
            where: { user_id: userId },
            update: {
                experience: data.experience,
                languages: data.languages,
                expertise: data.expertise,
                price: parseFloat(data.price),
                availability: data.availability,
            },
            create: {
                user_id: userId,
                experience: data.experience,
                languages: data.languages,
                expertise: data.expertise,
                price: parseFloat(data.price),
                availability: data.availability,
            },
        });

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
