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
        <section id="amenities" className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        What We Offer
                    </h2>
                    <p className="text-gray-600 max-w-xl mx-auto">
                        Enjoy our wide range of amenities designed for your comfort
                    </p>
                </div>

                {/* Amenities Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {accommodation.amenities.map((amenity) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                            <div
                                key={amenity}
                                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Icon size={18} style={{ color: themeColor }} />
                                </div>
                                <span className="text-gray-900 text-sm font-medium">{amenity}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
