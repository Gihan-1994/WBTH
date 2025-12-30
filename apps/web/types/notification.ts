export type NotificationType =
    | "BOOKING_CREATED"
    | "BOOKING_CONFIRMED"
    | "BOOKING_CANCELLED"
    | "BOOKING_UPDATED"
    | "PAYMENT_RECEIVED"
    | "PAYMENT_SENT";

export interface Notification {
    id: string;
    user_id: string;
    type: NotificationType;
    message: string;
    booking_id: string | null;
    is_read: boolean;
    metadata: NotificationMetadata | null;
    created_at: string;
    booking?: {
        id: string;
        type: string;
        status: string;
        start_date: string;
        end_date: string;
    } | null;
}

export interface NotificationMetadata {
    booking_id: string;
    booker_id: string;
    booker_name: string;
    provider_id: string;
    provider_name: string;
    booking_type: string;
    old_status?: string;
    new_status: string;
    updated_at: string;
    start_date: string;
    end_date: string;
}

export interface NotificationResponse {
    notifications: Notification[];
    unreadCount: number;
    total: number;
}
