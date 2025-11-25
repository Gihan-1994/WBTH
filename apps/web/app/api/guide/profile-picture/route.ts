import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@repo/prisma/src/client";

// Maximum file size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed image formats
const ALLOWED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        const data = await req.json();
        const { image } = data;

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Validate Base64 format
        const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/;
        if (!base64Pattern.test(image)) {
            return NextResponse.json(
                { error: "Invalid image format. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Extract the base64 data and mime type
        const matches = image.match(/^data:(image\/[a-z]+);base64,(.+)$/);
        if (!matches) {
            return NextResponse.json(
                { error: "Invalid Base64 string" },
                { status: 400 }
            );
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        // Validate mime type
        if (!ALLOWED_FORMATS.includes(mimeType)) {
            return NextResponse.json(
                { error: "Invalid image format. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (approximate size from base64)
        const sizeInBytes = (base64Data.length * 3) / 4;
        if (sizeInBytes > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Image size exceeds 2MB limit" },
                { status: 400 }
            );
        }

        // Update the guide's profile picture
        await prisma.guide.update({
            where: { user_id: userId },
            data: { profile_picture: image },
        });

        return NextResponse.json({
            message: "Profile picture uploaded successfully",
            profile_picture: image,
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        return NextResponse.json(
            { error: "Failed to upload profile picture" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    try {
        // Remove the guide's profile picture
        await prisma.guide.update({
            where: { user_id: userId },
            data: { profile_picture: null },
        });

        return NextResponse.json({
            message: "Profile picture removed successfully",
        });
    } catch (error) {
        console.error("Error removing profile picture:", error);
        return NextResponse.json(
            { error: "Failed to remove profile picture" },
            { status: 500 }
        );
    }
}
