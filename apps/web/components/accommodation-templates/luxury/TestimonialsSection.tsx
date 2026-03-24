"use client";

import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { AccommodationData, CustomSections } from "../types";

interface TestimonialsSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function TestimonialsSection({ accommodation, themeColor }: TestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const customSections = accommodation.custom_sections as CustomSections | null;
    const testimonials = customSections?.testimonials || [];

    if (testimonials.length === 0) return null;

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-20 md:py-28 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: themeColor }}
                    >
                        Guest Reviews
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3">
                        What Our Guests Say
                    </h2>
                </div>

                {/* Testimonial Card */}
                <div className="relative">
                    <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
                        {/* Quote Icon */}
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-8"
                            style={{ backgroundColor: `${themeColor}30` }}
                        >
                            <Quote size={28} style={{ color: themeColor }} />
                        </div>

                        {/* Rating */}
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={20}
                                    className={i < currentTestimonial.rating ? "text-amber-400" : "text-gray-600"}
                                    fill={i < currentTestimonial.rating ? "currentColor" : "none"}
                                />
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-lg md:text-xl text-gray-300 text-center leading-relaxed mb-8">
                            "{currentTestimonial.text}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center justify-center gap-4">
                            {currentTestimonial.avatar ? (
                                <img
                                    src={currentTestimonial.avatar}
                                    alt={currentTestimonial.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    {currentTestimonial.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <p className="font-semibold">{currentTestimonial.name}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prevTestimonial}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform hidden md:flex"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={nextTestimonial}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform hidden md:flex"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Dots */}
                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                                    idx === currentIndex ? "" : "bg-gray-600"
                                }`}
                                style={idx === currentIndex ? { backgroundColor: themeColor } : {}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
