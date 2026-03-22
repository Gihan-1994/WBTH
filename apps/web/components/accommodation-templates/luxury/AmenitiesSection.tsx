"use client";

import {
    Wifi,
    Car,
    Utensils,
    Wind,
    Tv,
    Coffee,
    Bath,
    Mountain,
    Waves,
    Dumbbell,
    ShowerHead,
    UtensilsCrossed,
    Flower2,
    Sparkles,
    WashingMachine,
    Refrigerator,
    CircleParking,
    Check
} from "lucide-react";
import { AccommodationData } from "../types";

interface AmenitiesSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

const amenityIcons: Record<string, any> = {
    "wifi": Wifi,
    "wi-fi": Wifi,
    "parking": Car,
    "free parking": CircleParking,
    "restaurant": Utensils,
    "air conditioning": Wind,
    "ac": Wind,
    "tv": Tv,
    "television": Tv,
    "coffee": Coffee,
    "breakfast": Coffee,
    "bathroom": Bath,
    "private bathroom": Bath,
    "mountain view": Mountain,
    "pool": Waves,
    "swimming pool": Waves,
    "gym": Dumbbell,
    "fitness": Dumbbell,
    "hot water": ShowerHead,
    "kitchen": UtensilsCrossed,
    "garden": Flower2,
    "spa": Sparkles,
    "laundry": WashingMachine,
    "minibar": Refrigerator,
    "refrigerator": Refrigerator,
};

const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
        if (lowerAmenity.includes(key)) {
            return Icon;
        }
    }
    return Check;
};

export default function AmenitiesSection({ accommodation, themeColor }: AmenitiesSectionProps) {
    if (accommodation.amenities.length === 0) return null;

    return (
        <section id="amenities" className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: themeColor }}
                    >
                        What We Offer
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
                        Amenities & Services
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Experience the finest amenities designed to make your stay comfortable and memorable.
                    </p>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {accommodation.amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                            <div
                                key={amenity}
                                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                            >
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Icon size={26} style={{ color: themeColor }} />
                                </div>
                                <p className="font-medium text-gray-900">{amenity}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Travel Styles & Interests */}
                {(accommodation.travel_style.length > 0 || accommodation.interests.length > 0) && (
                    <div className="mt-16 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Perfect For</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {accommodation.travel_style.map((style) => (
                                <span
                                    key={style}
                                    className="px-5 py-2 rounded-full text-sm font-medium border-2 transition-colors hover:text-white"
                                    style={{
                                        borderColor: themeColor,
                                        color: themeColor,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = themeColor;
                                        e.currentTarget.style.color = "white";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                        e.currentTarget.style.color = themeColor;
                                    }}
                                >
                                    {style}
                                </span>
                            ))}
                            {accommodation.interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="px-5 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
