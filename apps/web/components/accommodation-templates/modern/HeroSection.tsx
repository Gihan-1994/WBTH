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
        <section id="home" className="pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content */}
                    <div className="order-2 lg:order-1">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {accommodation.type.map((t) => (
                                <span
                                    key={t}
                                    className="text-xs font-medium px-3 py-1 rounded-full"
                                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                >
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Name */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            {accommodation.name}
                        </h1>

                        {/* Tagline */}
                        {accommodation.tagline && (
                            <p className="text-lg text-gray-600 mb-4">
                                {accommodation.tagline}
                            </p>
                        )}

                        {/* Location & Rating */}
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                            <span className="flex items-center gap-1.5">
                                <MapPin size={18} className="text-gray-400" />
                                {accommodation.location || accommodation.district}
                            </span>
                            {accommodation.rating && (
                                <span className="flex items-center gap-1.5">
                                    <Star size={18} className="text-amber-400" fill="currentColor" />
                                    <span className="font-semibold text-gray-900">{accommodation.rating.toFixed(1)}</span>
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-8 line-clamp-3">
                            {accommodation.description ||
                                `Experience the perfect getaway at ${accommodation.name}. Located in ${accommodation.location || accommodation.district}, we offer exceptional comfort and memorable experiences.`}
                        </p>

                        {/* Price & CTA */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Starting from</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                    <span className="text-sm font-normal text-gray-500"> / night</span>
                                </p>
                            </div>
                            <button
                                onClick={onBook}
                                className="px-8 py-3 text-white font-semibold rounded-lg transition-transform hover:scale-105"
                                style={{ backgroundColor: themeColor }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="order-1 lg:order-2">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                            {images.length > 0 ? (
                                <img
                                    src={images[currentIndex]}
                                    alt={accommodation.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    No images available
                                </div>
                            )}

                            {/* Navigation */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition"
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    {/* Counter */}
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                {images.slice(0, 5).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition ${
                                            idx === currentIndex ? "ring-2" : "opacity-60 hover:opacity-100"
                                        }`}
                                        style={idx === currentIndex ? { ringColor: themeColor } : {}}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
