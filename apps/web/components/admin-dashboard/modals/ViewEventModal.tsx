"use client";

import { useState } from "react";
import { X, Calendar, MapPin, Tag, ChevronLeft, ChevronRight } from "lucide-react";
import { EventData } from "../types";

interface ViewEventModalProps {
    event: EventData;
    onClose: () => void;
}

/**
 * Modal for viewing event details
 */
export default function ViewEventModal({ event, onClose }: ViewEventModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === event.eventImages.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? event.eventImages.length - 1 : prev - 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Event Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Images Carousel */}
                    {event.eventImages && event.eventImages.length > 0 && (
                        <div className="relative">
                            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={event.eventImages[currentImageIndex]}
                                    alt={`${event.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {event.eventImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                                    >
                                        <ChevronLeft size={24} className="text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                                    >
                                        <ChevronRight size={24} className="text-gray-800" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white rounded-full text-sm font-semibold">
                                        {currentImageIndex + 1} / {event.eventImages.length}
                                    </div>
                                </>
                            )}

                            {/* Thumbnail Navigation */}
                            {event.eventImages.length > 1 && (
                                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                    {event.eventImages.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? "border-blue-600 scale-105"
                                                    : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <img
                                                src={image}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Title */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                        <h3 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Tag className="text-orange-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Category</p>
                                    <p className="text-lg font-semibold text-gray-800">{event.category}</p>
                                </div>
                            </div>
                        </div>

                        {/* Date */}
                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Date & Time</p>
                                    <p className="text-lg font-semibold text-gray-800">{formatDate(event.date)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 md:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Location</p>
                                    <p className="text-lg font-semibold text-gray-800">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {event.description && event.description.length > 0 && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Description</h4>
                            <ul className="space-y-2">
                                {event.description.map((desc, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 leading-relaxed">{desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="pt-4">
                        <button
                            onClick={onClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
