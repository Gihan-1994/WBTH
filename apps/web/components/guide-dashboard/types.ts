// Shared TypeScript interfaces for Guide Dashboard components

export interface GuideProfile {
    name: string;
    email: string;
    contact_no: string | null;
    experience: string[];
    languages: string[];
    expertise: string[];
    price: number;
    booking_price: number | null;
    availability: boolean;
    city: string | null;
    province: string | null;
    gender: string | null;
    account_no: string | null;
    rating: number | null;
    profile_picture: string | null;
    email_notifications_enabled: boolean;
}

export interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    user?: {
        name: string;
        email: string;
        contact_no: string | null;
    };
}

export interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    income: number;
    averageRating?: number;
}
