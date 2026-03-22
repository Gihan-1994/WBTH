"use client";

import { ChevronDown, Star, MapPin } from "lucide-react";
import { AccommodationData } from "../types";

interface HeroSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
    onBook: () => void;
}

export default function HeroSection({ accommodation, themeColor, onBook }: HeroSectionProps) {
    const heroImageIndex = accommodation.hero_image_index || 0;
    const heroImage = accommodation.images[heroImageIndex] || accommodation.images[0];

    const scrollToAbout = () => {
        const element = document.getElementById("about");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="home" className="relative h-screen min-h-[600px]">
            {/* Background Image */}
            <div className="absolute inset-0">
                {heroImage ? (
                    <img
                        src={heroImage}
                        alt={accommodation.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                {/* Tagline */}
                {accommodation.tagline && (
                    <p className="text-white/80 text-lg md:text-xl font-light tracking-[0.3em] uppercase mb-4">
                        {accommodation.tagline}
                    </p>
                )}

                {/* Name */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
                    {accommodation.name}
                </h1>

                {/* Location & Rating */}
                <div className="flex items-center gap-6 text-white/90 mb-8">
                    <span className="flex items-center gap-2">
                        <MapPin size={18} />
                        {accommodation.location || accommodation.district}
                    </span>
                    {accommodation.rating && (
                        <span className="flex items-center gap-1.5">
                            <Star size={18} className="text-amber-400" fill="currentColor" />
                            <span className="font-semibold">{accommodation.rating.toFixed(1)}</span>
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="mb-10">
                    <span className="text-white/70 text-sm uppercase tracking-wider">Starting from</span>
                    <p className="text-3xl md:text-4xl font-bold text-white">
                        LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                        <span className="text-lg font-normal text-white/70"> / night</span>
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onBook}
                    className="px-10 py-4 text-lg font-semibold text-white rounded-full transition-all hover:scale-105 hover:shadow-xl"
                    style={{ backgroundColor: themeColor }}
                >
                    Book Your Stay
                </button>
            </div>

            {/* Scroll Indicator */}
            <button
                onClick={scrollToAbout}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce"
            >
                <ChevronDown size={32} />
            </button>
        </section>
    );
}
