"use client";

import { useState } from "react";
import { MapPin, Clock, Tag, ExternalLink } from "lucide-react";
import PublicViewEventModal from "./PublicViewEventModal";

interface Event {
    id: string;
    title: string;
    category: string;
    date: Date;
    location: string;
    description: string[];
    eventImages: string[];
}

interface EventCardProps {
    event: Event;
}

/**
 * EventCard component for displaying individual event details
 */
export default function EventCard({ event }: EventCardProps) {
    const [showModal, setShowModal] = useState(false);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            <div
                onClick={() => setShowModal(true)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer flex flex-col h-full"
            >
                {/* Image Section */}
                <div className="h-40 overflow-hidden relative">
                    {event.eventImages && event.eventImages.length > 0 ? (
                        <img
                            src={event.eventImages[0]}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <Tag className="text-indigo-300" size={40} />
                        </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-sm text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                            {event.category}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                    {/* Title */}
                    <h4 className="font-display text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-3">
                        {event.title}
                    </h4>

                    {/* Info */}
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-2 text-indigo-500" />
                            <span>{formatTime(event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <MapPin size={14} className="mr-2 text-indigo-500" />
                            <span className="line-clamp-1">{event.location}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                            View Details →
                        </span>
                    </div>
                </div>
            </div>

            {/* Event Modal */}
            {showModal && (
                <PublicViewEventModal
                    event={event}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
