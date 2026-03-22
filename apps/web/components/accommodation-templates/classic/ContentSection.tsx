"use client";

import { useState } from "react";
import { Clock, CalendarCheck, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { AccommodationData } from "../types";

interface ContentSectionProps {
    accommodation: AccommodationData;
    themeColor: string;
    onBook: () => void;
}

export default function ContentSection({ accommodation, themeColor, onBook }: ContentSectionProps) {
    const [activeTab, setActiveTab] = useState<"about" | "amenities" | "gallery" | "rules">("about");
    const [galleryIndex, setGalleryIndex] = useState(0);

    const tabs = [
        { id: "about", label: "About" },
        { id: "amenities", label: "Amenities" },
        { id: "gallery", label: "Gallery" },
        ...(accommodation.house_rules && accommodation.house_rules.length > 0 ? [{ id: "rules", label: "House Rules" }] : []),
    ];

    return (
        <section id="about" className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-8">
                            <div className="flex gap-8 overflow-x-auto">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                                            activeTab === tab.id
                                                ? "text-gray-900"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <span
                                                className="absolute bottom-0 left-0 right-0 h-0.5"
                                                style={{ backgroundColor: themeColor }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[300px]">
                            {/* About Tab */}
                            {activeTab === "about" && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                                        Welcome to {accommodation.name}
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed mb-6">
                                        {accommodation.description ||
                                            `Experience exceptional hospitality at ${accommodation.name}. Nestled in ${accommodation.location || accommodation.district}, our property offers a perfect blend of comfort and elegance. Whether you're here for business or leisure, we ensure a memorable stay with our personalized service and attention to detail.`}
                                    </p>

                                    {/* Quick Info */}
                                    <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <Clock size={24} style={{ color: themeColor }} />
                                            <div>
                                                <p className="text-sm text-gray-500">Check-in Time</p>
                                                <p className="font-medium text-gray-900">
                                                    {accommodation.check_in_time || "2:00 PM"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                            <CalendarCheck size={24} style={{ color: themeColor }} />
                                            <div>
                                                <p className="text-sm text-gray-500">Check-out Time</p>
                                                <p className="font-medium text-gray-900">
                                                    {accommodation.check_out_time || "11:00 AM"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {(accommodation.travel_style.length > 0 || accommodation.interests.length > 0) && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-medium text-gray-500 mb-3">Ideal For</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {accommodation.travel_style.map((style) => (
                                                    <span
                                                        key={style}
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm"
                                                    >
                                                        {style}
                                                    </span>
                                                ))}
                                                {accommodation.interests.map((interest) => (
                                                    <span
                                                        key={interest}
                                                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Amenities Tab */}
                            {activeTab === "amenities" && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                        Our Amenities
                                    </h2>
                                    {accommodation.amenities.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            {accommodation.amenities.map((amenity) => (
                                                <div
                                                    key={amenity}
                                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                                                >
                                                    <Check size={18} style={{ color: themeColor }} />
                                                    <span className="text-gray-700">{amenity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No amenities listed yet.</p>
                                    )}
                                </div>
                            )}

                            {/* Gallery Tab */}
                            {activeTab === "gallery" && (
                                <div id="facilities">
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                        Photo Gallery
                                    </h2>
                                    {accommodation.images.length > 0 ? (
                                        <>
                                            {/* Main Image */}
                                            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                                <img
                                                    src={accommodation.images[galleryIndex]}
                                                    alt={`Gallery ${galleryIndex + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {accommodation.images.length > 1 && (
                                                    <>
                                                        <button
                                                            onClick={() => setGalleryIndex((prev) => (prev - 1 + accommodation.images.length) % accommodation.images.length)}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                                                        >
                                                            <ChevronLeft size={20} />
                                                        </button>
                                                        <button
                                                            onClick={() => setGalleryIndex((prev) => (prev + 1) % accommodation.images.length)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow"
                                                        >
                                                            <ChevronRight size={20} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                            {/* Thumbnails */}
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {accommodation.images.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setGalleryIndex(idx)}
                                                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition ${
                                                            idx === galleryIndex ? "ring-2" : "opacity-60 hover:opacity-100"
                                                        }`}
                                                        style={idx === galleryIndex ? { ringColor: themeColor } : {}}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`Thumbnail ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No images available.</p>
                                    )}
                                </div>
                            )}

                            {/* House Rules Tab */}
                            {activeTab === "rules" && (
                                <div>
                                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                                        House Rules
                                    </h2>
                                    <div className="space-y-3">
                                        {accommodation.house_rules?.map((rule, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                                            >
                                                <span
                                                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-medium"
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
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 mt-12 lg:mt-0">
                        <div className="sticky top-24 border border-gray-200 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div
                                className="p-4 text-white"
                                style={{ backgroundColor: themeColor }}
                            >
                                <p className="text-sm opacity-80">Starting from</p>
                                <p className="text-2xl font-bold">
                                    LKR {(accommodation.booking_price || accommodation.price_range_min || 0).toLocaleString()}
                                    <span className="text-sm font-normal opacity-80"> / night</span>
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-4">
                                <button
                                    onClick={onBook}
                                    className="w-full py-3 text-white font-medium rounded transition-colors"
                                    style={{ backgroundColor: themeColor }}
                                >
                                    Book Now
                                </button>

                                <div className="text-sm text-gray-600 space-y-2">
                                    <div className="flex justify-between">
                                        <span>Check-in</span>
                                        <span className="font-medium text-gray-900">
                                            {accommodation.check_in_time || "2:00 PM"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Check-out</span>
                                        <span className="font-medium text-gray-900">
                                            {accommodation.check_out_time || "11:00 AM"}
                                        </span>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500 mb-2">Questions?</p>
                                    {accommodation.provider.user.contact_no && (
                                        <a
                                            href={`tel:${accommodation.provider.user.contact_no}`}
                                            className="block text-sm font-medium hover:underline"
                                            style={{ color: themeColor }}
                                        >
                                            {accommodation.provider.user.contact_no}
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${accommodation.provider.user.email}`}
                                        className="block text-sm font-medium hover:underline"
                                        style={{ color: themeColor }}
                                    >
                                        {accommodation.provider.user.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
