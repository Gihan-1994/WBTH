export interface UserProfile {
    name: string;
    email: string;
    contact_no: string | null;
    country: string;
    dob: string | null;
    email_notifications_enabled: boolean;
    profile_picture: string | null;
}

export interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    type: string;
    accommodation?: { name: string };
    guide?: { user: { name: string } };
}

export interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
}
