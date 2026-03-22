"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { AccommodationData } from "../types";

interface ContactSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
}

export default function ContactSection({ accommodation, themeColor }: ContactSectionProps) {
    return (
        <section id="contact" className="py-12 md:py-16 bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                        Contact Us
                    </h2>
                    <p className="text-gray-400">
                        We're here to help you plan your perfect stay
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Phone */}
                    {accommodation.provider.user.contact_no && (
                        <a
                            href={`tel:${accommodation.provider.user.contact_no}`}
                            className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                                style={{ backgroundColor: `${themeColor}30` }}
                            >
                                <Phone size={20} style={{ color: themeColor }} />
                            </div>
                            <p className="text-sm text-gray-400 mb-1">Phone</p>
                            <p className="font-medium">{accommodation.provider.user.contact_no}</p>
                        </a>
                    )}

                    {/* Email */}
                    <a
                        href={`mailto:${accommodation.provider.user.email}`}
                        className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                    >
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}30` }}
                        >
                            <Mail size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Email</p>
                        <p className="font-medium truncate max-w-full">
                            {accommodation.provider.user.email}
                        </p>
                    </a>

                    {/* Location */}
                    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}30` }}
                        >
                            <MapPin size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="font-medium">
                            {accommodation.location || accommodation.district}
                            {accommodation.province && `, ${accommodation.province}`}
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                            style={{ backgroundColor: `${themeColor}30` }}
                        >
                            <Clock size={20} style={{ color: themeColor }} />
                        </div>
                        <p className="text-sm text-gray-400 mb-1">Reception</p>
                        <p className="font-medium">24/7 Available</p>
                    </div>
                </div>

                {/* Hosted By */}
                <div className="mt-12 text-center">
                    <p className="text-gray-400 text-sm mb-2">Hosted by</p>
                    <p className="text-lg font-medium">{accommodation.provider.user.name}</p>
                </div>
            </div>
        </section>
    );
}
