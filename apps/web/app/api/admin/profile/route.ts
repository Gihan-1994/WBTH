import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getAdminProfile } from "@/lib/admin/adminAuth";
import { prisma } from "@repo/prisma";

/**
 * Get admin profile
 * GET /api/admin/profile
 */
export async function GET(req: NextRequest) {
    try {
        const session = await requireAdmin();

        // @ts-ignore
        const profile = await getAdminProfile(session.user.id);

        if (!profile) {
            return NextResponse.json(
                { error: "Admin profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ profile });

    } catch (error: any) {
        console.error("Error fetching admin profile:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch admin profile" },
            { status: 500 }
        );
    }
}

/**
 * Update admin profile
 * PUT /api/admin/profile
 */
export async function PUT(req: NextRequest) {
    try {
        const session = await requireAdmin();

        const body = await req.json();
        const { name, email, contact_no } = body;

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (contact_no !== undefined) updateData.contact_no = contact_no;

        // @ts-ignore
        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                contact_no: true,
                role: true,
            }
        });

        return NextResponse.json({
            success: true,
            user
        });

    } catch (error: any) {
        console.error("Error updating admin profile:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update admin profile" },
            { status: 500 }
        );
    }
}
