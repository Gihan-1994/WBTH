import { prisma } from "@repo/prisma";
import { sendNotificationEmail, getEmailSubject } from "../email";

/**
 * Send a broadcast message to all users
 */
export async function sendBroadcastMessage(message: string, sendEmail: boolean = false) {
    // Get all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            email_notifications_enabled: true,
        }
    });

    const notifications = [];

    for (const user of users) {
        // Create in-app notification
        const notification = await prisma.notification.create({
            data: {
                user_id: user.id,
                type: "ADMIN_MESSAGE",
                message: message,
                metadata: {
                    sent_at: new Date().toISOString(),
                    type: "broadcast"
                } as any,
            }
        });

        notifications.push(notification);

        // Send email if enabled
        if (sendEmail && user.email && user.email_notifications_enabled) {
            sendNotificationEmail({
                to: user.email,
                subject: "📢 Important Message from Admin",
                message: message,
            }).catch(err => {
                console.error(`Failed to send email to ${user.email}:`, err);
            });
        }
    }

    return notifications;
}

/**
 * Send a selective message to specific users
 */
export async function sendSelectiveMessage(
    userIds: string[],
    message: string,
    sendEmail: boolean = false
) {
    // Get selected users
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            email: true,
            email_notifications_enabled: true,
        }
    });

    const notifications = [];

    for (const user of users) {
        // Create in-app notification
        const notification = await prisma.notification.create({
            data: {
                user_id: user.id,
                type: "ADMIN_MESSAGE",
                message: message,
                metadata: {
                    sent_at: new Date().toISOString(),
                    type: "selective"
                } as any,
            }
        });

        notifications.push(notification);

        // Send email if enabled
        if (sendEmail && user.email && user.email_notifications_enabled) {
            sendNotificationEmail({
                to: user.email,
                subject: "📢 Message from Admin",
                message: message,
            }).catch(err => {
                console.error(`Failed to send email to ${user.email}:`, err);
            });
        }
    }

    return notifications;
}

/**
 * Create an admin message notification for a specific user
 */
export async function createAdminNotification(userId: string, message: string) {
    const notification = await prisma.notification.create({
        data: {
            user_id: userId,
            type: "ADMIN_MESSAGE",
            message: message,
            metadata: {
                sent_at: new Date().toISOString(),
                type: "direct"
            } as any,
        }
    });

    return notification;
}

/**
 * Delete admin messages (notifications)
 */
export async function deleteAdminMessages(notificationIds: string[]) {
    await prisma.notification.deleteMany({
        where: {
            id: {
                in: notificationIds
            },
            type: "ADMIN_MESSAGE"
        }
    });
}
