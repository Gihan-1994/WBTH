import { prisma, NotificationType, BookingStatus, BookingType } from "@repo/prisma";
import { sendNotificationEmail, getEmailSubject } from "./email";

interface NotificationMetadata {
    booking_id: string;
    booker_id: string;
    booker_name: string;
    provider_id: string;
    provider_name: string;
    booking_type: BookingType;
    old_status?: BookingStatus;
    new_status: BookingStatus;
    updated_at: string;
    start_date: string;
    end_date: string;
}

interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    message: string;
    bookingId: string;
    metadata: NotificationMetadata;
}

/**
 * Notification message templates
 * Uses "you" for the actor who triggered the action
 */
export const NOTIFICATION_TEMPLATES = {
    BOOKING_CREATED: {
        forTourist: (providerName: string, bookingId: string, bookingType: string) =>
            `You placed a ${bookingType} booking (${bookingId}) with ${providerName}. Awaiting confirmation.`,
        forProvider: (touristName: string, bookingId: string, bookingType: string) =>
            `${touristName} placed a ${bookingType} booking (${bookingId}). Please review and confirm.`,
    },
    BOOKING_CONFIRMED: {
        forTourist: (providerName: string, bookingId: string) =>
            `Your booking (${bookingId}) with ${providerName} has been confirmed!`,
        forProvider: (bookingId: string) =>
            `You confirmed booking ${bookingId}.`,
    },
    BOOKING_CANCELLED: {
        forTourist: (bookingId: string, cancelledByYou: boolean) =>
            cancelledByYou
                ? `You cancelled booking ${bookingId}.`
                : `Your booking (${bookingId}) has been cancelled by the provider.`,
        forProvider: (touristName: string, bookingId: string, cancelledByYou: boolean) =>
            cancelledByYou
                ? `You cancelled booking ${bookingId}.`
                : `${touristName} cancelled booking ${bookingId}.`,
    },
};

/**
 * Create a single notification (both in-app and email)
 */
export async function createNotification(params: CreateNotificationParams) {
    // Create in-app notification
    const notification = await prisma.notification.create({
        data: {
            user_id: params.userId,
            type: params.type,
            message: params.message,
            booking_id: params.bookingId,
            metadata: params.metadata as any,
        },
    });

    // Send email notification only if user has enabled email notifications
    const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: {
            email: true,
            email_notifications_enabled: true,
        },
    });

    if (user?.email && user.email_notifications_enabled) {
        // Send email without awaiting (non-blocking)
        sendNotificationEmail({
            to: user.email,
            subject: getEmailSubject(params.type),
            message: params.message,
            bookingId: params.bookingId,
        }).catch(err => {
            console.error(`Failed to send email to ${user.email}:`, err);
        });
    } else if (user && !user.email_notifications_enabled) {
        console.log(`User ${params.userId} has disabled email notifications`);
    }

    return notification;
}

/**
 * Notify both parties involved in a booking when it's created
 */
export async function notifyBookingCreated(params: {
    bookingId: string;
    touristId: string;
    touristName: string;
    providerId: string;
    providerName: string;
    bookingType: BookingType;
    startDate: Date;
    endDate: Date;
}) {
    const metadata: NotificationMetadata = {
        booking_id: params.bookingId,
        booker_id: params.touristId,
        booker_name: params.touristName,
        provider_id: params.providerId,
        provider_name: params.providerName,
        booking_type: params.bookingType,
        new_status: "pending",
        updated_at: new Date().toISOString(),
        start_date: params.startDate.toISOString(),
        end_date: params.endDate.toISOString(),
    };

    // Notify tourist
    await createNotification({
        userId: params.touristId,
        type: "BOOKING_CREATED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CREATED.forTourist(
            params.providerName,
            params.bookingId,
            params.bookingType
        ),
        bookingId: params.bookingId,
        metadata,
    });

    // Notify provider
    await createNotification({
        userId: params.providerId,
        type: "BOOKING_CREATED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CREATED.forProvider(
            params.touristName,
            params.bookingId,
            params.bookingType
        ),
        bookingId: params.bookingId,
        metadata,
    });
}

/**
 * Notify both parties when a booking is confirmed
 */
export async function notifyBookingConfirmed(params: {
    bookingId: string;
    touristId: string;
    touristName: string;
    providerId: string;
    providerName: string;
    bookingType: BookingType;
    startDate: Date;
    endDate: Date;
}) {
    const metadata: NotificationMetadata = {
        booking_id: params.bookingId,
        booker_id: params.touristId,
        booker_name: params.touristName,
        provider_id: params.providerId,
        provider_name: params.providerName,
        booking_type: params.bookingType,
        old_status: "pending",
        new_status: "confirmed",
        updated_at: new Date().toISOString(),
        start_date: params.startDate.toISOString(),
        end_date: params.endDate.toISOString(),
    };

    // Notify tourist
    await createNotification({
        userId: params.touristId,
        type: "BOOKING_CONFIRMED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CONFIRMED.forTourist(
            params.providerName,
            params.bookingId
        ),
        bookingId: params.bookingId,
        metadata,
    });

    // Notify provider (who confirmed)
    await createNotification({
        userId: params.providerId,
        type: "BOOKING_CONFIRMED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CONFIRMED.forProvider(params.bookingId),
        bookingId: params.bookingId,
        metadata,
    });
}

/**
 * Notify both parties when a booking is cancelled
 */
export async function notifyBookingCancelled(params: {
    bookingId: string;
    touristId: string;
    touristName: string;
    providerId: string;
    providerName: string;
    bookingType: BookingType;
    startDate: Date;
    endDate: Date;
    cancelledBy: "tourist" | "provider";
}) {
    const metadata: NotificationMetadata = {
        booking_id: params.bookingId,
        booker_id: params.touristId,
        booker_name: params.touristName,
        provider_id: params.providerId,
        provider_name: params.providerName,
        booking_type: params.bookingType,
        old_status: "pending",
        new_status: "cancelled",
        updated_at: new Date().toISOString(),
        start_date: params.startDate.toISOString(),
        end_date: params.endDate.toISOString(),
    };

    // Notify tourist
    await createNotification({
        userId: params.touristId,
        type: "BOOKING_CANCELLED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CANCELLED.forTourist(
            params.bookingId,
            params.cancelledBy === "tourist"
        ),
        bookingId: params.bookingId,
        metadata,
    });

    // Notify provider
    await createNotification({
        userId: params.providerId,
        type: "BOOKING_CANCELLED",
        message: NOTIFICATION_TEMPLATES.BOOKING_CANCELLED.forProvider(
            params.touristName,
            params.bookingId,
            params.cancelledBy === "provider"
        ),
        bookingId: params.bookingId,
        metadata,
    });
}
