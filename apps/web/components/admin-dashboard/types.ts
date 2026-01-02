// Admin Dashboard TypeScript Interfaces

export interface AdminProfile {
    id: string;
    user_id: string;
    user: {
        id: string;
        name: string;
        email: string;
        contact_no: string | null;
        role: string;
        created_at: Date;
    };
}

export interface AnalyticsData {
    userStats: {
        total: number;
        byType: Record<string, number>;
        growth: { date: string; count: number }[];
    };
    bookingStats: {
        total: number;
        byStatus: Record<string, number>;
        overTime: { date: string; count: number }[];
        conversionRate: number;
    };
    revenueStats: {
        total: number;
        trends: { date: string; amount: number }[];
    };
    popularDestinations: { location: string; count: number }[];
    activeGuides: number;
    activeProviders: number;
}

export interface UserData {
    id: string;
    name: string;
    email: string;
    contact_no: string | null;
    role: string;
    created_at: Date;
    email_notifications_enabled: boolean;
}

export interface GuideData {
    user_id: string;
    experience: string[];
    languages: string[];
    expertise: string[];
    rating: number | null;
    account_no: string | null;
    price: number | null;
    availability: boolean;
    profile_picture: string | null;
    city: string | null;
    province: string | null;
    gender: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        contact_no: string | null;
    };
    _count: {
        bookings: number;
    };
}

export interface BookingData {
    id: string;
    user_id: string;
    type: string;
    start_date: Date;
    end_date: Date;
    location: string | null;
    price: number;
    status: string;
    description: string[];
    user: {
        id: string;
        name: string;
        email: string;
    };
    guide: {
        user: {
            name: string;
        };
    } | null;
    accommodation: {
        name: string;
        provider: {
            company_name: string;
        };
    } | null;
}

export interface AccommodationData {
    id: string;
    name: string;
    type: string[];
    amenities: string[];
    rating: number | null;
    district: string;
    location: string | null;
    price_range_min: number | null;
    price_range_max: number | null;
    images: string[];
    _count: {
        bookings: number;
    };
}

export interface ProviderData {
    provider_id: string;
    company_name: string;
    logo: string | null;
    user: {
        id: string;
        name: string;
        email: string;
        contact_no: string | null;
    };
    accommodations: AccommodationData[];
}

export interface EventData {
    id: string;
    name: string | null;
    category: string;
    date: Date;
    location: string;
    description: string[];
    images: string[];
    created_at?: Date;
    updated_at?: Date;
}

export interface MessageData {
    type: "broadcast" | "selective";
    userIds?: string[];
    message: string;
    sendEmail: boolean;
}
