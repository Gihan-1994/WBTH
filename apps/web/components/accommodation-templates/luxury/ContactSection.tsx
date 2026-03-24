"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { AccommodationData } from "../types";

interface ContactSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
    onBook: () => void;
}

export default function ContactSection({ accommodation, themeColor, onBook }: ContactSectionProps) {
    return (
        <section id="contact" className="py-20 md:py-28 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <span
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: themeColor }}
                    >
                        Get In Touch
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
                        Contact Us
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                            Ready to experience {accommodation.name}?
                        </h3>
                        <p className="text-gray-600 mb-8">
                            Get in touch with us for any inquiries or to make a reservation.
                            Our team is here to help you plan your perfect stay.
                        </p>

                        <div className="space-y-6">
                            {/* Phone */}
                            {accommodation.provider.user.contact_no && (
                                <a
                                    href={`tel:${accommodation.provider.user.contact_no}`}
                                    className="flex items-center gap-4 group"
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${themeColor}15` }}
                                    >
                                        <Phone size={22} style={{ color: themeColor }} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-semibold text-gray-900">
                                            {accommodation.provider.user.contact_no}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {/* Email */}
                            <a
                                href={`mailto:${accommodation.provider.user.email}`}
                                className="flex items-center gap-4 group"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Mail size={22} style={{ color: themeColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">
                                        {accommodation.provider.user.email}
                                    </p>
                                </div>
                            </a>

                            {/* Location */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <MapPin size={22} style={{ color: themeColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-semibold text-gray-900">
                                        {accommodation.location || accommodation.district}
                                        {accommodation.province && `, ${accommodation.province}`}
                                    </p>
                                </div>
                            </div>

                            {/* Check-in/out */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${themeColor}15` }}
                                >
                                    <Clock size={22} style={{ color: themeColor }} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Hours</p>
                                    <p className="font-semibold text-gray-900">
                                        Check-in: {accommodation.check_in_time || "2:00 PM"} |
                                        Check-out: {accommodation.check_out_time || "11:00 AM"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div
                        className="rounded-2xl p-8 md:p-10 text-white flex flex-col justify-center"
                        style={{ backgroundColor: themeColor }}
                    >
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            Book Your Stay Today
                        </h3>
                        <p className="text-white/80 mb-8">
                            Experience the comfort and luxury of {accommodation.name}.
                            Reserve your room now and create unforgettable memories.
                        </p>

                        <div className="mb-8">
                            <p className="text-white/70 text-sm mb-1">Starting from</p>
                            <p className="text-3xl font-bold">
                                LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                <span className="text-lg font-normal text-white/70"> / night</span>
                            </p>
                        </div>

                        <button
                            onClick={onBook}
                            className="w-full py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            Reserve Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
