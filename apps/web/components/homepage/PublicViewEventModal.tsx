"use client";

import { X, MapPin, Clock, Calendar, Tag } from "lucide-react";

interface Event {
    id: string;
    title: string;
    category: string;
    date: Date;
    location: string;
    description: string[];
    eventImages: string[];
}

interface PublicViewEventModalProps {
    event: Event;
    onClose: () => void;
}

/**
 * Public-facing modal for viewing event details
 */
export default function PublicViewEventModal({ event, onClose }: PublicViewEventModalProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (Floating) */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-20 backdrop-blur-md border border-white/20"
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Image Section */}
                    <div className="w-full md:w-1/2 aspect-video md:aspect-auto relative bg-gray-100">
                        {event.eventImages && event.eventImages.length > 0 ? (
                            <img
                                src={event.eventImages[0]}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100">
                                <Calendar size={64} className="text-orange-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                        <div className="absolute bottom-4 left-6 md:hidden">
                            <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold uppercase tracking-wider">
                                {event.category}
                            </span>
                            <h2 className="text-2xl font-bold text-white mt-2">{event.title}</h2>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto custom-scrollbar">
                        <div className="hidden md:block mb-6">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                {event.category}
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mt-3">{event.title}</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Meta Info */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Calendar className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Date</p>
                                        <p className="text-gray-600">{formatDate(event.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <Clock className="text-orange-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Time</p>
                                        <p className="text-gray-600">{formatTime(event.date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <MapPin className="text-green-600" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Location</p>
                                        <p className="text-gray-600">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Description */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">About Event</h3>
                                <div className="space-y-4">
                                    {event.description.map((desc, index) => (
                                        <p key={index} className="text-gray-600 leading-relaxed flex gap-3">
                                            <span className="text-orange-500 font-bold">•</span>
                                            {desc}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
