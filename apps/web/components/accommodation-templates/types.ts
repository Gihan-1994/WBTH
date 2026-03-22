// Types for accommodation templates

export interface AccommodationData {
    id: string;
    name: string;
    location: string | null;
    district: string;
    province: string | null;
    price_range_min: number | null;
    price_range_max: number | null;
    booking_price: number | null;
    images: string[];
    rating: number | null;
    type: string[];
    amenities: string[];
    interests: string[];
    travel_style: string[];
    online_payment_enabled: boolean;

    // Website template fields
    description: string | null;
    tagline: string | null;
    check_in_time: string | null;
    check_out_time: string | null;
    house_rules: string[];
    theme_color: string | null;
    hero_image_index: number | null;
    template_style: string | null;
    custom_sections: CustomSections | null;

    provider: {
        user: {
            name: string;
            email: string;
            contact_no: string | null;
        };
    };
}

export interface CustomSections {
    facilities?: FacilityItem[];
    cuisines?: CuisineItem[];
    testimonials?: TestimonialItem[];
    rooms?: RoomItem[];
}

export interface FacilityItem {
    id: string;
    name: string;
    description?: string;
    icon?: string;
}

export interface CuisineItem {
    id: string;
    name: string;
    description?: string;
    image?: string;
}

export interface TestimonialItem {
    id: string;
    name: string;
    text: string;
    rating: number;
    avatar?: string;
}

export interface RoomItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    features?: string[];
}

export interface TemplateProps {
    accommodation: AccommodationData;
    onBook: () => void;
}

export type TemplateStyle = 'modern' | 'classic' | 'luxury';
