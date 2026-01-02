import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { requireAdmin } from "@/lib/admin/adminAuth";
import bcrypt from "bcryptjs";

/**
 * Update a user
 * PUT /api/admin/users/[id]
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAdmin();
        const userId = params.id;

        const body = await req.json();
        const { name, email, contact_no, password } = body;

        // Build update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (contact_no !== undefined) updateData.contact_no = contact_no;
        if (password) {
            updateData.password_hash = await bcrypt.hash(password, 10);
        }

        // Update user
        const user = await prisma.user.update({
            where: { id: userId },
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
        console.error("Error updating user:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}

/**
 * Delete a user (except admin's own account)
 * DELETE /api/admin/users/[id]
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAdmin();
        const userId = params.id;

        // Prevent admin from deleting their own account
        // @ts-ignore
        if (session.user.id === userId) {
            return NextResponse.json(
                { error: "Cannot delete your own account" },
                { status: 400 }
            );
        }

        // Get user to determine role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Delete role-specific record first (due to foreign key constraints)
        if (user.role === "tourist") {
            await prisma.tourist.delete({
                where: { user_id: userId }
            }).catch(() => { });
        } else if (user.role === "guide") {
            await prisma.guide.delete({
                where: { user_id: userId }
            }).catch(() => { });
        } else if (user.role === "accommodation_provider") {
            await prisma.accommodationProvider.delete({
                where: { user_id: userId }
            }).catch(() => { });
        } else if (user.role === "admin") {
            await prisma.admin.delete({
                where: { user_id: userId }
            }).catch(() => { });
        }

        // Delete user
        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error: any) {
        console.error("Error deleting user:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete user" },
            { status: 500 }
        );
    }
}
