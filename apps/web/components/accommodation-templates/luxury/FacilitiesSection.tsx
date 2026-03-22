"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccommodationData, CustomSections } from "../types";

interface FacilitiesSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function FacilitiesSection({ accommodation, themeColor }: FacilitiesSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const customSections = accommodation.custom_sections as CustomSections | null;
    const facilities = customSections?.facilities || [];
    const images = accommodation.images.slice(0, 6);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section id="facilities" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: themeColor }}
                    >
                        Explore Our Property
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
                        Our Facilities
                    </h2>
                </div>

                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="relative mb-16">
                        <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden">
                            <img
                                src={images[currentIndex]}
                                alt={`Facility ${currentIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500"
                            />
                        </div>

                        {/* Navigation */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                                idx === currentIndex ? "bg-white" : "bg-white/50"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-16">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`aspect-square rounded-lg overflow-hidden transition-all ${
                                    idx === currentIndex
                                        ? "ring-2 ring-offset-2"
                                        : "opacity-70 hover:opacity-100"
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

                {/* Facilities List */}
                {facilities.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {facilities.map((facility) => (
                            <div
                                key={facility.id}
                                className="p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {facility.name}
                                </h3>
                                {facility.description && (
                                    <p className="text-gray-600">{facility.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* House Rules */}
                {accommodation.house_rules && accommodation.house_rules.length > 0 && (
                    <div className="mt-16 p-8 rounded-2xl bg-gray-50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">House Rules</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {accommodation.house_rules.map((rule, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-medium"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {idx + 1}
                                    </span>
                                    <p className="text-gray-700">{rule}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
