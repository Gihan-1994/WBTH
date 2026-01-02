import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { prisma } from "@repo/prisma";
import bcrypt from "bcryptjs";

/**
 * Change admin password
 * POST /api/admin/change-password
 */
export async function POST(req: NextRequest) {
    try {
        const session = await requireAdmin();

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Current password and new password are required" },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Get user with password hash
        // @ts-ignore
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                password_hash: true,
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 }
            );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash: newPasswordHash,
            }
        });

        return NextResponse.json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error: any) {
        console.error("Error changing password:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to change password" },
            { status: 500 }
        );
    }
}
