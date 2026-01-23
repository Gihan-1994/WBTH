// TypeScript interfaces for Provider Dashboard

export interface ProviderProfile {
    name: string;
    email: string;
    contact_no: string | null;
    company_name: string;
    location: string;
    provider_id: string | null;
    logo: string | null;
    email_notifications_enabled: boolean;
}

export interface Accommodation {
    id: string;
    name: string;
    district: string;
    location: string | null;
    type: string[];
    amenities: string[];
    budget: string[];
    interests: string[];
    price_range_min: number;
    price_range_max: number;
    booking_price: number | null;
    rating: number | null;
    province: string | null;
    group_size: number | null;
    account_no: string | null;
    images: string[];
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
    accommodation?: {
        name: string;
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
