"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, MapPin } from "lucide-react";
import { AccommodationData } from "../types";

interface HeroSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
    onBook: () => void;
}

export default function HeroSection({ accommodation, themeColor, onBook }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(accommodation.hero_image_index || 0);
    const images = accommodation.images;

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section id="home" className="pt-16 md:pt-20">
            {/* Image Slider */}
            <div className="relative aspect-[21/9] md:aspect-[3/1] bg-gray-100">
                {images.length > 0 ? (
                    <img
                        src={images[currentIndex]}
                        alt={accommodation.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No images available
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

                {/* Navigation */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12">
                    <div className="max-w-4xl">
                        {/* Tagline */}
                        {accommodation.tagline && (
                            <p className="text-white/80 text-sm md:text-base tracking-wider uppercase mb-2">
                                {accommodation.tagline}
                            </p>
                        )}

                        {/* Name */}
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
                            {accommodation.name}
                        </h1>

                        {/* Location & Rating */}
                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={16} />
                                {accommodation.location || accommodation.district}
                            </span>
                            {accommodation.rating && (
                                <span className="flex items-center gap-1.5">
                                    <Star size={16} className="text-amber-400" fill="currentColor" />
                                    {accommodation.rating.toFixed(1)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dots */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex gap-1.5">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    idx === currentIndex ? "bg-white" : "bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Info Bar */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between py-4 gap-4">
                        {/* Property Types */}
                        <div className="flex flex-wrap gap-2">
                            {accommodation.type.map((t) => (
                                <span
                                    key={t}
                                    className="px-3 py-1 border rounded-full text-sm"
                                    style={{ borderColor: themeColor, color: themeColor }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Price & Book */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">From</p>
                                <p className="text-xl font-bold text-gray-900">
                                    LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                    <span className="text-sm font-normal text-gray-500"> / night</span>
                                </p>
                            </div>
                            <button
                                onClick={onBook}
                                className="px-6 py-2.5 text-white font-medium rounded transition-transform hover:scale-105"
                                style={{ backgroundColor: themeColor }}
                            >
                                Reserve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
