import { getServerSession } from "next-auth";
import { authOptions } from "../auth-options";
import { prisma } from "@repo/prisma";
import { NextRequest } from "next/server";

/**
 * Check if the current user is an admin
 */
export async function isAdmin(session: any): Promise<boolean> {
    if (!session?.user?.id) return false;

    const admin = await prisma.admin.findUnique({
        where: { user_id: session.user.id }
    });

    return !!admin;
}

/**
 * Get admin profile data
 */
export async function getAdminProfile(userId: string) {
    const admin = await prisma.admin.findUnique({
        where: { user_id: userId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    contact_no: true,
                    role: true,
                    created_at: true,
                }
            }
        }
    });

    return admin;
}

/**
 * Require admin authentication for API routes
 * Returns the session if user is admin, throws error otherwise
 */
export async function requireAdmin() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    // @ts-ignore
    if (session.user.role !== "admin") {
        throw new Error("Forbidden: Admin access required");
    }

    return session;
}

/**
 * Check if an admin already exists in the system
 */
export async function adminExists(): Promise<boolean> {
    const count = await prisma.admin.count();
    return count > 0;
}
