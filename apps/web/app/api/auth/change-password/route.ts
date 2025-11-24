import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma/src/client";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json(
            { error: "Missing current or new password" },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.password_hash) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await verifyPassword(currentPassword, user.password_hash);

        if (!isMatch) {
            return NextResponse.json(
                { error: "Incorrect current password" },
                { status: 400 }
            );
        }

        const newHash = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password_hash: newHash },
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return NextResponse.json(
            { error: "Failed to change password" },
            { status: 500 }
        );
    }
}
