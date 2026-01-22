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
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 cursor-pointer flex flex-col h-full hover:-translate-y-1"
            >
                {/* Image Section */}
                <div className="aspect-video overflow-hidden relative">
                    {event.eventImages && event.eventImages.length > 0 ? (
                        <img
                            src={event.eventImages[0]}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                            <Tag className="text-orange-400" size={48} />
                        </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <ExternalLink size={18} />
                            <span className="font-semibold">View Details</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                        {/* Category */}
                        <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">
                            {event.category}
                        </span>

                        {/* Title */}
                        <h4 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-tight">
                            {event.title}
                        </h4>

                        {/* Info List */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-1.5 bg-orange-50 rounded-lg">
                                    <Clock size={14} className="text-orange-500" />
                                </div>
                                <span className="font-medium">{formatTime(event.date)}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="p-1.5 bg-orange-50 rounded-lg">
                                    <MapPin size={14} className="text-orange-500" />
                                </div>
                                <span className="line-clamp-1 font-medium">{event.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Button (Just for visual cue) */}
                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <span className="text-sm font-bold text-orange-600">See full details</span>
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <ExternalLink size={16} />
                        </div>
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
