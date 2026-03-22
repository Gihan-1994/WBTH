"use client";

import { Clock, CalendarCheck, Users, CreditCard } from "lucide-react";
import { AccommodationData } from "../types";

interface AboutSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function AboutSection({ accommodation, themeColor }: AboutSectionProps) {
    return (
        <section id="about" className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        About {accommodation.name}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        {accommodation.description ||
                            `Welcome to ${accommodation.name}, your perfect destination in ${accommodation.location || accommodation.district}. We offer exceptional accommodations with modern amenities and personalized service to ensure your stay is comfortable and memorable.`}
                    </p>
                </div>

                {/* Info Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}15` }}
                        >
                            <Clock size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Check-in</p>
                        <p className="font-semibold text-gray-900">
                            {accommodation.check_in_time || "2:00 PM"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}15` }}
                        >
                            <CalendarCheck size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Check-out</p>
                        <p className="font-semibold text-gray-900">
                            {accommodation.check_out_time || "11:00 AM"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}15` }}
                        >
                            <Users size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Group Size</p>
                        <p className="font-semibold text-gray-900">
                            {accommodation.group_size ? `Up to ${accommodation.group_size}` : "Flexible"}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}15` }}
                        >
                            <CreditCard size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">Payment</p>
                        <p className="font-semibold text-gray-900">
                            {accommodation.online_payment_enabled ? "Online / At Property" : "At Property"}
                        </p>
                    </div>
                </div>

                {/* Travel Styles */}
                {(accommodation.travel_style.length > 0 || accommodation.interests.length > 0) && (
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500 mb-4">Perfect for</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {accommodation.travel_style.map((style) => (
                                <span
                                    key={style}
                                    className="px-4 py-2 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                                >
                                    {style}
                                </span>
                            ))}
                            {accommodation.interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
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
