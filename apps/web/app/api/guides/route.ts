import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@repo/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const language = searchParams.get("language");
    const expertise = searchParams.get("expertise");
    const price = searchParams.get("price");

    const where: Prisma.GuideWhereInput = {};

    if (location) {
        where.OR = [
            { city: { contains: location, mode: "insensitive" } },
            { province: { contains: location, mode: "insensitive" } },
        ];
    }

    if (language) {
        const languageList = language.split(",").map((l) => l.trim());
        where.languages = {
            hasSome: languageList,
        };
    }

    if (expertise) {
        const expertiseList = expertise.split(",").map((e) => e.trim());
        where.expertise = {
            hasSome: expertiseList,
        };
    }

    if (price) {
        const p = parseFloat(price);
        if (!isNaN(p)) {
            where.price = {
                lte: p,
            };
        }
    }

    try {
        const guides = await prisma.guide.findMany({
            where,
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

        return NextResponse.json(guides);
    } catch (error) {
        console.error("Error fetching guides:", error);
        return NextResponse.json(
            { error: "Failed to fetch guides" },
            { status: 500 }
        );
    }
}
