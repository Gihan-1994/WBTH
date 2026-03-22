"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { AccommodationData } from "../types";

interface ContactSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
    onBook: () => void;
}

export default function ContactSection({ accommodation, themeColor, onBook }: ContactSectionProps) {
    return (
        <section id="contact" className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Have questions or ready to book? Reach out to us and we'll help you plan your perfect stay.
                        </p>

                        <div className="space-y-4">
                            {accommodation.provider.user.contact_no && (
                                <a
                                    href={`tel:${accommodation.provider.user.contact_no}`}
                                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: `${themeColor}15` }}
                                    >
                                        <Phone size={18} style={{ color: themeColor }} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900">
                                            {accommodation.provider.user.contact_no}
                                        </p>
                                    </div>
                                </a>
                            )}

                            <a
                                href={`mailto:${accommodation.provider.user.email}`}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Mail size={18} style={{ color: themeColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium text-gray-900">
                                        {accommodation.provider.user.email}
                                    </p>
                                </div>
                            </a>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <MapPin size={18} style={{ color: themeColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">
                                        {accommodation.location || accommodation.district}
                                        {accommodation.province && `, ${accommodation.province}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="bg-gray-900 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-3">Ready to Book?</h3>
                        <p className="text-gray-400 mb-6">
                            Reserve your stay at {accommodation.name} and enjoy a memorable experience.
                        </p>

                        <div className="mb-6 pb-6 border-b border-gray-700">
                            <p className="text-sm text-gray-400 mb-1">Starting from</p>
                            <p className="text-3xl font-bold">
                                LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                <span className="text-sm font-normal text-gray-400"> / night</span>
                            </p>
                        </div>

                        <button
                            onClick={onBook}
                            className="w-full py-3 font-semibold rounded-lg transition-transform hover:scale-[1.02] text-white"
                            style={{ backgroundColor: themeColor }}
                        >
                            Book Now
                        </button>

                        <p className="text-center text-gray-500 text-sm mt-4">
                            Free cancellation available
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
