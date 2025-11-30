import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id },
            include: {
                provider: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                contact_no: true,
                            },
                        },
                    },
                },
            },
        });

        if (!accommodation) {
            return NextResponse.json(
                { error: "Accommodation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(accommodation);
    } catch (error) {
        console.error("Error fetching accommodation:", error);
        return NextResponse.json(
            { error: "Failed to fetch accommodation" },
            { status: 500 }
        );
    }
}
