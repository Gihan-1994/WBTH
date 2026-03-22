import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma";

/**
 * PUT handler for updating accommodation website settings.
 * @param req - The incoming request object.
 * @param params - Route parameters containing the accommodation ID.
 * @returns JSON response with updated accommodation or error.
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const { id: accommodationId } = await params;
    const data = await req.json();

    try {
        const accommodation = await prisma.accommodation.findUnique({
            where: { id: accommodationId },
            include: { provider: true },
        });

        if (!accommodation) {
            return NextResponse.json(
                { error: "Accommodation not found" },
                { status: 404 }
            );
        }

        // Authorization check
        if (accommodation.provider.user_id !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedAccommodation = await prisma.accommodation.update({
            where: { id: accommodationId },
            data: {
                description: data.description,
                tagline: data.tagline,
                check_in_time: data.check_in_time,
                check_out_time: data.check_out_time,
                house_rules: data.house_rules,
                theme_color: data.theme_color,
                hero_image_index: data.hero_image_index,
                template_style: data.template_style,
                custom_sections: data.custom_sections,
            },
        });

        return NextResponse.json({
            message: "Website settings updated successfully",
            accommodation: updatedAccommodation,
        });
    } catch (error: any) {
        console.error("Error updating website settings:", error);
        return NextResponse.json(
            { error: "Failed to update website settings" },
            { status: 500 }
        );
    }
}
