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
    online_payment_enabled: boolean;
    // Website template fields
    description?: string | null;
    tagline?: string | null;
    check_in_time?: string | null;
    check_out_time?: string | null;
    house_rules?: string[];
    theme_color?: string | null;
    hero_image_index?: number | null;
    template_style?: string | null;
    custom_sections?: any;
}

export interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    price: number;
    status: string;
    payment_method: "online" | "pay_at_property";
    is_paid: boolean;
    user?: {
        name: string;
        email: string;
        contact_no: string | null;
    };
    accommodation?: {
        name: string;
    };
    payments?: {
        status: string;
    }[];
}

export interface Stats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    income: number;
    averageRating?: number;
}
