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
    console.log("Profile API: Fetching for userId:", userId);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { tourist: true },
        });
        console.log("Profile API: User found:", user ? "yes" : "no", user?.name);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: user.name,
            email: user.email,
            contact_no: user.contact_no,
            country: user.tourist?.country || "",
            dob: user.tourist?.dob || null,
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

        // Update or Create Tourist model
        await prisma.tourist.upsert({
            where: { user_id: userId },
            update: {
                country: data.country,
                dob: data.dob ? new Date(data.dob) : null,
            },
            create: {
                user_id: userId,
                country: data.country,
                dob: data.dob ? new Date(data.dob) : null,
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
