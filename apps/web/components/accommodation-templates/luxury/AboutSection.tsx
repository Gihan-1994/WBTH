"use client";

import { Clock, CalendarCheck, Shield } from "lucide-react";
import { AccommodationData } from "../types";

interface AboutSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function AboutSection({ accommodation, themeColor }: AboutSectionProps) {
    const secondaryImage = accommodation.images[1] || accommodation.images[0];

    return (
        <section id="about" className="py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                            {secondaryImage ? (
                                <img
                                    src={secondaryImage}
                                    alt="About"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100" />
                            )}
                        </div>
                        {/* Decorative Element */}
                        <div
                            className="absolute -bottom-6 -right-6 w-48 h-48 rounded-2xl -z-10"
                            style={{ backgroundColor: `${themeColor}20` }}
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <span
                            className="text-sm font-semibold uppercase tracking-wider"
                            style={{ color: themeColor }}
                        >
                            About Us
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-6">
                            Welcome to {accommodation.name}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8">
                            {accommodation.description ||
                                `Discover the perfect blend of comfort and elegance at ${accommodation.name}.
                                Located in the heart of ${accommodation.location || accommodation.district},
                                we offer an unforgettable experience with world-class amenities and
                                exceptional service that will make your stay truly memorable.`}
                        </p>

                        {/* Info Cards */}
                        <div className="grid sm:grid-cols-3 gap-4 mt-8">
                            <div className="bg-gray-50 rounded-xl p-5 text-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Clock size={22} style={{ color: themeColor }} />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Check-in</p>
                                <p className="text-gray-600">{accommodation.check_in_time || "2:00 PM"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-5 text-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <CalendarCheck size={22} style={{ color: themeColor }} />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Check-out</p>
                                <p className="text-gray-600">{accommodation.check_out_time || "11:00 AM"}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-5 text-center">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Shield size={22} style={{ color: themeColor }} />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Rating</p>
                                <p className="text-gray-600">{accommodation.rating?.toFixed(1) || "New"}</p>
                            </div>
                        </div>

                        {/* Property Types */}
                        {accommodation.type.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-8">
                                {accommodation.type.map((t) => (
                                    <span
                                        key={t}
                                        className="px-4 py-2 rounded-full text-sm font-medium"
                                        style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
