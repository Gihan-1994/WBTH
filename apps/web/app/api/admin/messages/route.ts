import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/adminAuth";
import { sendBroadcastMessage, sendSelectiveMessage } from "@/lib/admin/adminNotifications";

/**
 * Send broadcast or selective messages to users
 * POST /api/admin/messages
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const body = await req.json();
        const { type, userIds, message, sendEmail } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        let notifications;

        if (type === "broadcast") {
            notifications = await sendBroadcastMessage(message, sendEmail || false);
        } else if (type === "selective") {
            if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return NextResponse.json(
                    { error: "User IDs are required for selective messages" },
                    { status: 400 }
                );
            }
            notifications = await sendSelectiveMessage(userIds, message, sendEmail || false);
        } else {
            return NextResponse.json(
                { error: "Invalid message type. Must be 'broadcast' or 'selective'" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Messages sent successfully",
            count: notifications.length
        });

    } catch (error: any) {
        console.error("Error sending messages:", error);

        if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
            return NextResponse.json(
                { error: error.message },
                { status: 403 }
            );
        }

        return NextResponse.json(
            { error: "Failed to send messages" },
            { status: 500 }
        );
    }
}
