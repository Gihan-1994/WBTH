import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const guide = await prisma.guide.findUnique({
            where: { user_id: id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        contact_no: true,
                    },
                },
            },
        });

        if (!guide) {
            return NextResponse.json(
                { error: "Guide not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(guide);
    } catch (error) {
        console.error("Error fetching guide:", error);
        return NextResponse.json(
            { error: "Failed to fetch guide" },
            { status: 500 }
        );
    }
}
