import { NextResponse } from "next/server";
import { adminExists } from "@/lib/admin/adminAuth";

/**
 * Check if an admin already exists in the system
 * GET /api/admin/check-exists
 */
export async function GET() {
    try {
        const exists = await adminExists();

        return NextResponse.json({ exists });
    } catch (error) {
        console.error("Error checking admin existence:", error);
        return NextResponse.json(
            { error: "Failed to check admin existence" },
            { status: 500 }
        );
    }
}
